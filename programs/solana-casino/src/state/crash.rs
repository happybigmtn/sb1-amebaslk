use anchor_lang::prelude::*;

#[account]
pub struct CrashGame {
    pub start_block: u64,
    pub next_round_block: u64,
    pub current_multiplier: u64,
    pub crash_point: Option<u64>,
    pub round_active: bool,
    pub total_bets: u64,
    pub total_players: u32,
}

impl CrashGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // start_block
        8 + // next_round_block
        8 + // current_multiplier
        9 + // crash_point
        1 + // round_active
        8 + // total_bets
        4; // total_players
}

#[account]
pub struct CrashBet {
    pub player: Pubkey,
    pub amount: u64,
    pub auto_exit_multiplier: Option<u64>,
    pub exit_multiplier: Option<u64>,
    pub timestamp: i64,
    pub exited: bool,
}

impl CrashBet {
    pub const SPACE: usize = 8 + // discriminator
        32 + // player
        8 + // amount
        9 + // auto_exit_multiplier
        9 + // exit_multiplier
        8 + // timestamp
        1; // exited
}