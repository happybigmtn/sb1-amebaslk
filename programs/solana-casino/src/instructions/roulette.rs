use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::roulette::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct PlaceRouletteBet<'info> {
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

pub fn place_roulette_bet(ctx: Context<PlaceRouletteBet>, bet_type: u8, numbers: Vec<u8>, amount: u64) -> Result<()> {
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
    bet.numbers = numbers;
    bet.amount = amount;
    bet.timestamp = Clock::get()?.unix_timestamp;
    bet.settled = false;

    Ok(())
}

#[derive(Accounts)]
pub struct SpinRoulette<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub switchboard_program: AccountInfo<'info>,
}

pub fn spin_roulette(ctx: Context<SpinRoulette>) -> Result<()> {
    // Request randomness from Switchboard VRF
    let vrf_request = VrfRequestRandomness {
        vrf: ctx.accounts.vrf.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
        switchboard_program: ctx.accounts.switchboard_program.to_account_info(),
    };

    vrf_request.invoke()?;
    Ok(())
}