use anchor_lang::prelude::*;

#[account]
pub struct MinesGame {
    pub start_block: u64,
    pub next_round_block: u64,
    pub total_bets: u64,
    pub total_players: u32,
}

impl MinesGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // start_block
        8 + // next_round_block
        8 + // total_bets
        4;  // total_players
}

#[account]
pub struct MinesBet {
    pub player: Pubkey,
    pub amount: u64,
    pub grid_size: u8,
    pub mine_count: u8,
    pub mine_locations: Vec<u8>,
    pub revealed_cells: Vec<bool>,
    pub timestamp: i64,
    pub settled: bool,
}

impl MinesBet {
    pub const SPACE: usize = 8 + // discriminator
        32 + // player
        8 + // amount
        1 + // grid_size
        1 + // mine_count
        (4 + 24) + // mine_locations vec
        (4 + 49) + // revealed_cells vec
        8 + // timestamp
        1;  // settled
}