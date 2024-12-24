use anchor_lang::prelude::*;

#[account]
pub struct BlackjackGame {
    pub player: Pubkey,
    pub player_cards: Vec<u8>,
    pub dealer_cards: Vec<u8>,
    pub player_score: u8,
    pub dealer_score: u8,
    pub status: BlackjackStatus,
    pub bet_amount: u64,
    pub insurance_amount: Option<u64>,
    pub split: bool,
}

impl BlackjackGame {
    pub fn space() -> usize {
        8 + // discriminator
        32 + // player pubkey
        (4 + 52) + // player_cards vec
        (4 + 52) + // dealer_cards vec
        1 + // player_score
        1 + // dealer_score
        1 + // status
        8 + // bet_amount
        9 + // insurance_amount (Option)
        1 // split
    }
}