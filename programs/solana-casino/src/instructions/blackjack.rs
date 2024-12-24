use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct StartBlackjack<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = player,
        space = BlackjackGame::space()
    )]
    pub game: Account<'info, BlackjackGame>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn start_blackjack(ctx: Context<StartBlackjack>, bet_amount: u64) -> Result<()> {
    // Validate bet amount
    if bet_amount == 0 {
        return err!(CasinoError::InvalidBetAmount);
    }

    // Transfer tokens from player to treasury
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

    // Initialize game state
    let game = &mut ctx.accounts.game;
    game.player = ctx.accounts.player.key();
    game.bet_amount = bet_amount;
    game.status = BlackjackStatus::Active;
    
    // Deal initial cards (implementation pending VRF integration)
    // TODO: Implement secure card dealing using VRF

    Ok(())
}