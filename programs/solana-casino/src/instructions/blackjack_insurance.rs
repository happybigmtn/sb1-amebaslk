use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct TakeInsurance<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = game.player == player.key(),
        constraint = game.status == BlackjackStatus::Active,
        constraint = game.dealer_cards[0] == 1 // Ace
    )]
    pub game: Account<'info, BlackjackGame>,
    pub token_program: Program<'info, Token>,
}

pub fn take_insurance(ctx: Context<TakeInsurance>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let insurance_amount = game.bet_amount / 2;

    // Transfer insurance bet to treasury
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        ),
        insurance_amount,
    )?;

    game.insurance_amount = Some(insurance_amount);
    Ok(())
}