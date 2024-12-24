use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::hilo::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct PlaceHiloBet<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub game: Account<'info, HiloGame>,
    #[account(
        init,
        payer = player,
        space = HiloPlayer::space()
    )]
    pub player_state: Account<'info, HiloPlayer>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn place_hilo_bet(ctx: Context<PlaceHiloBet>, amount: u64) -> Result<()> {
    let game = &mut ctx.accounts.game;
    require!(!game.series_complete, CasinoError::GameNotActive);
    require!(amount > 0, CasinoError::InvalidBetAmount);
    
    // Transfer tokens to treasury
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        ),
        amount,
    )?;

    let player = &mut ctx.accounts.player_state;
    player.player = ctx.accounts.player.key();
    player.bet_amount = amount;
    player.entry_multiplier = game.multiplier;
    player.joined_at = Clock::get()?.unix_timestamp;
    player.active = true;

    game.active_players += 1;
    game.total_pot += amount;

    Ok(())
}

#[derive(Accounts)]
pub struct RevealCard<'info> {
    #[account(mut)]
    pub game: Account<'info, HiloGame>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub switchboard_program: AccountInfo<'info>,
}

pub fn reveal_card(ctx: Context<RevealCard>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let clock = Clock::get()?;
    
    require!(
        clock.slot >= game.next_card_block,
        CasinoError::ActionWindowNotExpired
    );

    // Generate random card using VRF
    let random_bytes = get_random_bytes(&ctx.accounts.vrf)?;
    let new_card = (random_bytes[0] % 52) + 1;
    
    // Update game state
    game.previous_card = game.current_card;
    game.current_card = Some(new_card);
    game.next_card_block = clock.slot + 15;

    // Update multiplier based on streak
    if let Some(prev) = game.previous_card {
        game.multiplier = calculate_multiplier(prev, new_card);
    }

    Ok(())
}

#[derive(Accounts)]
pub struct CashOut<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        constraint = player_state.player == player.key(),
        constraint = player_state.active,
        close = player
    )]
    pub player_state: Account<'info, HiloPlayer>,
    #[account(mut)]
    pub game: Account<'info, HiloGame>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn cash_out(ctx: Context<CashOut>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let player = &ctx.accounts.player_state;
    
    // Calculate winnings
    let winnings = player.bet_amount
        .checked_mul(game.multiplier)
        .ok_or(CasinoError::Overflow)?
        .checked_div(player.entry_multiplier)
        .ok_or(CasinoError::Overflow)?;

    // Transfer winnings to player
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.game.to_account_info(),
            },
            &[&[b"hilo", &[bump]]],
        ),
        winnings,
    )?;

    game.active_players -= 1;
    game.total_pot -= player.bet_amount;

    // Check if series is complete
    if game.active_players == 0 {
        game.series_complete = true;
    }

    Ok(())
}

fn calculate_multiplier(previous: u8, current: u8) -> u64 {
    let base_multiplier = match previous.cmp(&current) {
        std::cmp::Ordering::Less => 2,    // Higher
        std::cmp::Ordering::Greater => 2, // Lower
        std::cmp::Ordering::Equal => 14,  // Equal
    };

    // Additional multiplier based on card difference
    let diff = (previous as i8 - current as i8).abs() as u64;
    base_multiplier + diff
}