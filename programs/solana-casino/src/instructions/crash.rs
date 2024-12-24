use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::crash::*;
use crate::errors::CasinoError;
use crate::utils::vrf::*;

#[derive(Accounts)]
pub struct InitializeCrash<'info> {
    #[account(
        init,
        payer = authority,
        space = CrashGame::SPACE
    )]
    pub game: Account<'info, CrashGame>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceCrashBet<'info> {
    #[account(mut)]
    pub game: Account<'info, CrashGame>,
    #[account(
        init,
        payer = player,
        space = CrashBet::SPACE
    )]
    pub bet: Account<'info, CrashBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CashOut<'info> {
    #[account(mut)]
    pub game: Account<'info, CrashGame>,
    #[account(
        mut,
        constraint = bet.player == player.key(),
        constraint = !bet.exited,
        close = player
    )]
    pub bet: Account<'info, CrashBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn initialize_crash(ctx: Context<InitializeCrash>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let clock = Clock::get()?;
    
    game.start_block = clock.slot;
    game.next_round_block = clock.slot + ROUND_SPACING;
    game.round_active = false;
    game.total_bets = 0;
    game.total_players = 0;

    Ok(())
}

pub fn place_crash_bet(
    ctx: Context<PlaceCrashBet>,
    amount: u64,
    auto_exit_multiplier: Option<u64>
) -> Result<()> {
    let game = &mut ctx.accounts.game;
    require!(!game.round_active, CasinoError::GameNotActive);
    require!(amount >= MIN_BET && amount <= MAX_BET, CasinoError::InvalidBetAmount);

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
    bet.auto_exit_multiplier = auto_exit_multiplier;
    bet.timestamp = Clock::get()?.unix_timestamp;
    bet.exited = false;

    game.total_bets += amount;
    game.total_players += 1;

    Ok(())
}

pub fn cash_out(ctx: Context<CashOut>) -> Result<()> {
    let game = &ctx.accounts.game;
    require!(game.round_active, CasinoError::GameNotActive);

    let bet = &mut ctx.accounts.bet;
    let current_multiplier = calculate_multiplier(
        game.start_block,
        Clock::get()?.slot
    );

    let payout = bet.amount
        .checked_mul(current_multiplier)
        .ok_or(CasinoError::Overflow)?;

    // Transfer winnings
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.game.to_account_info(),
            },
            &[&[b"crash", &[bump]]],
        ),
        payout,
    )?;

    bet.exited = true;
    bet.exit_multiplier = Some(current_multiplier);

    Ok(())
}