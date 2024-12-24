use anchor_lang::prelude::*;

#[account]
pub struct PlinkoGame {
    pub start_block: u64,
    pub next_drop_block: u64,
    pub current_ball: Option<PlinkoPath>,
    pub total_bets: u64,
    pub total_payouts: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub struct PlinkoPath {
    pub directions: Vec<bool>, // true = right, false = left
    pub multiplier: u64,
    pub settled: bool,
}

impl PlinkoGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // start_block
        8 + // next_drop_block
        (1 + 16 + 8 + 1) + // current_ball (Option<PlinkoPath>)
        8 + // total_bets
        8; // total_payouts
}

#[account]
pub struct PlinkoBet {
    pub player: Pubkey,
    pub amount: u64,
    pub risk_level: RiskLevel,
    pub timestamp: i64,
    pub settled: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum RiskLevel {
    Low,    // More small multipliers
    Medium, // Balanced distribution
    High    // More high multipliers, but also more zeros
}

impl PlinkoBet {
    pub fn space() -> usize {
        8 + // discriminator
        32 + // player
        8 + // amount
        1 + // risk_level
        8 + // timestamp
        1 // settled
    }
}