use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct SplitHand<'info> {
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
        constraint = game.player_cards.len() == 2,
        constraint = game.player_cards[0] == game.player_cards[1]
    )]
    pub game: Account<'info, BlackjackGame>,
    #[account(
        init,
        payer = player,
        space = BlackjackGame::space()
    )]
    pub split_game: Account<'info, BlackjackGame>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn split_hand(ctx: Context<SplitHand>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let split_game = &mut ctx.accounts.split_game;
    
    // Transfer additional bet for split hand
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        ),
        game.bet_amount,
    )?;

    // Setup split game
    split_game.player = ctx.accounts.player.key();
    split_game.bet_amount = game.bet_amount;
    split_game.status = BlackjackStatus::Active;
    split_game.player_cards = vec![game.player_cards[1]];
    split_game.dealer_cards = game.dealer_cards.clone();
    split_game.dealer_score = game.dealer_score;

    // Update original game
    game.player_cards = vec![game.player_cards[0]];
    game.split = true;

    Ok(())
}