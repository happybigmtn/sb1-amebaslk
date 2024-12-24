use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum DicePrediction {
    Over,   // Over 3
    Under,  // Under 4
    Exact   // Specific number
}

#[account]
pub struct DiceGame {
    pub total_bets: u64,
    pub total_payouts: u64,
}

impl DiceGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // total_bets
        8;  // total_payouts
}

#[account]
pub struct DiceBet {
    pub player: Pubkey,
    pub amount: u64,
    pub prediction: DicePrediction,
    pub target_value: Option<u8>,
    pub roll: u8,
    pub payout: u64,
    pub timestamp: i64,
}

impl DiceBet {
    pub const SPACE: usize = 8 + // discriminator
        32 + // player
        8 + // amount
        1 + // prediction
        2 + // target_value
        1 + // roll
        8 + // payout
        8;  // timestamp
}

pub fn calculate_payout(
    amount: u64,
    prediction: &DicePrediction,
    target_value: Option<u8>,
    roll: u8
) -> u64 {
    match prediction {
        DicePrediction::Over => {
            if roll > 3 {
                amount * 2
            } else {
                0
            }
        },
        DicePrediction::Under => {
            if roll < 4 {
                amount * 2
            } else {
                0
            }
        },
        DicePrediction::Exact => {
            if Some(roll) == target_value {
                amount * 6
            } else {
                0
            }
        }
    }
}