use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::dice::*;
use crate::errors::CasinoError;
use crate::utils::vrf::*;

#[derive(Accounts)]
pub struct PlaceDiceBet<'info> {
    #[account(mut)]
    pub game: Account<'info, DiceGame>,
    #[account(
        init,
        payer = player,
        space = DiceBet::SPACE
    )]
    pub bet: Account<'info, DiceBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn place_dice_bet(
    ctx: Context<PlaceDiceBet>,
    amount: u64,
    prediction: DicePrediction,
    target_value: Option<u8>
) -> Result<()> {
    require!(amount >= MIN_BET && amount <= MAX_BET, CasinoError::InvalidBetAmount);
    
    if let DicePrediction::Exact = prediction {
        require!(
            target_value.is_some() && target_value.unwrap() >= 1 && target_value.unwrap() <= 6,
            CasinoError::InvalidBetAmount
        );
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

    // Generate random roll using VRF
    let random_value = get_random_bytes(&ctx.accounts.vrf)?[0];
    let roll = (random_value % 6) + 1;

    // Calculate payout
    let payout = calculate_payout(amount, &prediction, target_value, roll);

    let bet = &mut ctx.accounts.bet;
    bet.player = ctx.accounts.player.key();
    bet.amount = amount;
    bet.prediction = prediction;
    bet.target_value = target_value;
    bet.roll = roll;
    bet.payout = payout;
    bet.timestamp = Clock::get()?.unix_timestamp;

    // Transfer winnings if any
    if payout > 0 {
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.treasury.to_account_info(),
                    to: ctx.accounts.player_token_account.to_account_info(),
                    authority: ctx.accounts.game.to_account_info(),
                },
                &[&[b"dice", &[bump]]],
            ),
            payout,
        )?;
    }

    Ok(())
}