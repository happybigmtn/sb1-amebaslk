use anchor_lang::prelude::*;

#[account]
pub struct GlobalBlackjackState {
    pub betting_start_block: u64,
    pub betting_end_block: u64,
    pub dealer_cards: Vec<u8>,
    pub dealer_score: u8,
    pub game_status: GlobalGameStatus,
    pub round_number: u64,
    pub total_pot: u64,
    pub min_bet: u64,
    pub max_bet: u64,
    pub player_count: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GlobalGameStatus {
    BettingOpen,
    PlayerTurns,
    DealerTurn,
    Settling,
}

impl GlobalBlackjackState {
    pub const SPACE: usize = 8 + // discriminator
        8 + // betting_start_block
        8 + // betting_end_block
        (4 + 52) + // dealer_cards vec
        1 + // dealer_score
        1 + // game_status
        8 + // round_number
        8 + // total_pot
        8 + // min_bet
        8 + // max_bet
        4; // player_count
}

#[account]
pub struct PlayerState {
    pub player: Pubkey,
    pub cards: Vec<u8>,
    pub score: u8,
    pub bet_amount: u64,
    pub join_block: u64,
    pub round_number: u64,
    pub status: PlayerStatus,
    pub action_taken: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PlayerStatus {
    Betting,
    Active,
    Standing,
    Bust,
    Blackjack,
}