use anchor_lang::prelude::*;

#[account]
pub struct RouletteBet {
    pub player: Pubkey,
    pub bet_type: u8,
    pub numbers: Vec<u8>,
    pub amount: u64,
    pub timestamp: i64,
    pub settled: bool,
}

impl RouletteBet {
    pub fn space() -> usize {
        8 + // discriminator
        32 + // player pubkey
        1 + // bet_type
        (4 + 37) + // numbers vec (max 37 numbers)
        8 + // amount
        8 + // timestamp
        1 // settled
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RouletteResult {
    Pending,
    Win(u64),
    Lose,
}

#[account]
pub struct RouletteGame {
    pub last_spin: i64,
    pub last_number: u8,
    pub total_bets: u64,
    pub total_payouts: u64,
}

impl RouletteGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // last_spin
        1 + // last_number
        8 + // total_bets
        8; // total_payouts
}