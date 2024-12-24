use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::global_blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct InitializeGlobalGame<'info> {
    #[account(
        init,
        payer = authority,
        space = GlobalBlackjackState::SPACE
    )]
    pub global_state: Account<'info, GlobalBlackjackState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_global_game(ctx: Context<InitializeGlobalGame>) -> Result<()> {
    let clock = Clock::get()?;
    let state = &mut ctx.accounts.global_state;
    
    state.betting_start_block = clock.slot;
    state.betting_end_block = clock.slot + 15; // 15 blocks for betting window
    state.game_status = GlobalGameStatus::BettingOpen;
    state.round_number = 1;
    state.min_bet = 100_000; // 0.1 SOL in lamports
    state.max_bet = 1_000_000_000; // 1 SOL in lamports
    state.player_count = 0;
    
    Ok(())
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalBlackjackState>,
    #[account(
        init,
        payer = player,
        space = PlayerState::SPACE
    )]
    pub player_state: Account<'info, PlayerState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn join_game(ctx: Context<JoinGame>, bet_amount: u64) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;

    // Check if betting window is still open
    require!(
        clock.slot <= global_state.betting_end_block,
        CasinoError::BettingClosed
    );

    require!(
        bet_amount >= global_state.min_bet && bet_amount <= global_state.max_bet,
        CasinoError::InvalidBetAmount
    );

    // Transfer bet to treasury
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        ),
        bet_amount,
    )?;

    // Initialize player state
    let player_state = &mut ctx.accounts.player_state;
    player_state.player = ctx.accounts.player.key();
    player_state.bet_amount = bet_amount;
    player_state.join_block = clock.slot;
    player_state.round_number = global_state.round_number;
    player_state.status = PlayerStatus::Betting;
    player_state.action_taken = false;

    global_state.player_count += 1;
    global_state.total_pot += bet_amount;

    // Check if betting period is over
    if clock.slot >= global_state.betting_end_block {
        global_state.game_status = GlobalGameStatus::PlayerTurns;
    }

    Ok(())
}