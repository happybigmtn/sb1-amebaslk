use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::keno::*;
use crate::errors::CasinoError;
use crate::utils::vrf::*;

#[derive(Accounts)]
pub struct InitializeKeno<'info> {
    #[account(
        init,
        payer = authority,
        space = KenoGame::SPACE
    )]
    pub game: Account<'info, KenoGame>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceKenoBet<'info> {
    #[account(mut)]
    pub game: Account<'info, KenoGame>,
    #[account(
        init,
        payer = player,
        space = KenoBet::SPACE
    )]
    pub bet: Account<'info, KenoBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_keno(ctx: Context<InitializeKeno>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let clock = Clock::get()?;
    
    game.start_block = clock.slot;
    game.next_draw_block = clock.slot + ROUND_SPACING;
    game.round_active = false;
    game.total_bets = 0;
    game.total_players = 0;

    Ok(())
}

pub fn place_keno_bet(
    ctx: Context<PlaceKenoBet>,
    amount: u64,
    selected_numbers: Vec<u8>
) -> Result<()> {
    let game = &mut ctx.accounts.game;
    require!(!game.round_active, CasinoError::GameNotActive);
    require!(amount >= MIN_BET && amount <= MAX_BET, CasinoError::InvalidBetAmount);
    require!(
        selected_numbers.len() <= MAX_SELECTED_NUMBERS,
        CasinoError::InvalidBetAmount
    );

    // Validate numbers
    for num in &selected_numbers {
        require!(*num > 0 && *num <= 80, CasinoError::InvalidBetAmount);
    }

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

    let bet = &mut ctx.accounts.bet;
    bet.player = ctx.accounts.player.key();
    bet.amount = amount;
    bet.selected_numbers = selected_numbers;
    bet.timestamp = Clock::get()?.unix_timestamp;
    bet.settled = false;

    game.total_bets += amount;
    game.total_players += 1;

    Ok(())
}