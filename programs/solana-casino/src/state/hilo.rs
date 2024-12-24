use anchor_lang::prelude::*;

#[account]
pub struct HiloGame {
    pub start_block: u64,
    pub next_card_block: u64,
    pub current_card: Option<u8>,
    pub previous_card: Option<u8>,
    pub active_players: u32,
    pub total_pot: u64,
    pub multiplier: u64,
    pub series_complete: bool,
}

impl HiloGame {
    pub const SPACE: usize = 8 + // discriminator
        8 + // start_block
        8 + // next_card_block
        2 + // current_card (Option<u8>)
        2 + // previous_card (Option<u8>)
        4 + // active_players
        8 + // total_pot
        8 + // multiplier
        1; // series_complete
}

#[account]
pub struct HiloPlayer {
    pub player: Pubkey,
    pub bet_amount: u64,
    pub entry_multiplier: u64,
    pub joined_at: i64,
    pub active: bool,
}

impl HiloPlayer {
    pub fn space() -> usize {
        8 + // discriminator
        32 + // player
        8 + // bet_amount
        8 + // entry_multiplier
        8 + // joined_at
        1 // active
    }
}