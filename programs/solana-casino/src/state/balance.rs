use anchor_lang::prelude::*;

#[account]
pub struct Balance {
    pub owner: Pubkey,
    pub ubi_amount: u64,
    pub fm_amount: u64,
    pub last_claim: i64,
}

impl Balance {
    pub const SPACE: usize = 8 + // discriminator
        32 + // owner
        8 + // ubi_amount
        8 + // fm_amount
        8; // last_claim
}