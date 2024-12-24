use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::roulette_bets::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct PlaceCallBet<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = player,
        space = RouletteBet::space()
    )]
    pub bet: Account<'info, RouletteBet>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn place_call_bet(
    ctx: Context<PlaceCallBet>,
    bet_type: BetType,
    amount: u64
) -> Result<()> {
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

    let bet = &mut ctx.accounts.bet;
    bet.player = ctx.accounts.player.key();
    bet.bet_type = bet_type;
    bet.amount = amount;
    bet.timestamp = Clock::get()?.unix_timestamp;
    bet.settled = false;

    Ok(())
}