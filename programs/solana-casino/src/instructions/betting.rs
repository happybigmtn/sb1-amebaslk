use anchor_lang::prelude::*;
use crate::state::balance::*;
use crate::errors::CasinoError;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Currency {
    UBI,
    FM
}

pub fn place_bet(
    ctx: Context<PlaceBet>,
    amount: u64,
    currency: Currency
) -> Result<()> {
    let balance = &mut ctx.accounts.balance;
    
    match currency {
        Currency::UBI => {
            require!(balance.ubi_amount >= amount, CasinoError::InsufficientFunds);
            balance.ubi_amount = balance.ubi_amount.checked_sub(amount)
                .ok_or(CasinoError::Overflow)?;
        },
        Currency::FM => {
            require!(balance.fm_amount >= amount, CasinoError::InsufficientFunds);
            balance.fm_amount = balance.fm_amount.checked_sub(amount)
                .ok_or(CasinoError::Overflow)?;
        }
    }

    Ok(())
}

pub fn settle_bet(
    ctx: Context<SettleBet>,
    amount: u64,
    currency: Currency,
    multiplier: u64
) -> Result<()> {
    let balance = &mut ctx.accounts.balance;
    let winnings = amount.checked_mul(multiplier)
        .ok_or(CasinoError::Overflow)?;
    
    match currency {
        Currency::UBI => {
            balance.ubi_amount = balance.ubi_amount.checked_add(winnings)
                .ok_or(CasinoError::Overflow)?;
        },
        Currency::FM => {
            balance.fm_amount = balance.fm_amount.checked_add(winnings)
                .ok_or(CasinoError::Overflow)?;
        }
    }

    Ok(())
}