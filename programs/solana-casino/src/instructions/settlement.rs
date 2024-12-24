use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::global_blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct SettlePlayer<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalBlackjackState>,
    #[account(
        mut,
        constraint = player_state.round_number == global_state.round_number,
        close = player
    )]
    pub player_state: Account<'info, PlayerState>,
    #[account(mut)]
    pub player: SystemAccount<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn settle_player(ctx: Context<SettlePlayer>) -> Result<()> {
    let global_state = &ctx.accounts.global_state;
    let player_state = &ctx.accounts.player_state;
    
    require!(
        global_state.game_status == GlobalGameStatus::Settling,
        CasinoError::InvalidGameState
    );

    let payout = calculate_payout(
        player_state.bet_amount,
        player_state.score,
        global_state.dealer_score
    );

    if payout > 0 {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.treasury.to_account_info(),
                    to: ctx.accounts.player_token_account.to_account_info(),
                    authority: ctx.accounts.global_state.to_account_info(),
                },
            ),
            payout,
        )?;
    }

    Ok(())
}