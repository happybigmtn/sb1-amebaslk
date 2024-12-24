use anchor_lang::prelude::*;

#[account]
pub struct KenoGame {
    pub start_block: u64,
    pub next_draw_block: u64,
    pub drawn_numbers: Vec<u8>,
    pub round_active: bool,
    pub total_bets: u64,
    pub total_players: u32,
}

impl KenoGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // start_block
        8 + // next_draw_block
        (4 + 20) + // drawn_numbers vec
        1 + // round_active
        8 + // total_bets
        4; // total_players
}

#[account]
pub struct KenoBet {
    pub player: Pubkey,
    pub amount: u64,
    pub selected_numbers: Vec<u8>,
    pub timestamp: i64,
    pub settled: bool,
}

impl KenoBet {
    pub const SPACE: usize = 8 + // discriminator
        32 + // player
        8 + // amount
        (4 + 10) + // selected_numbers vec
        8 + // timestamp
        1; // settled
}