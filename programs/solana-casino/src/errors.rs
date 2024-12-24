use anchor_lang::prelude::*;

#[error_code]
pub enum CasinoError {
    #[msg("Invalid bet amount")]
    InvalidBetAmount,
    #[msg("Game is not active")]
    GameNotActive,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid game type")]
    InvalidGameType,
    #[msg("Invalid game state")]
    InvalidGameState,
    #[msg("Invalid player state")]
    InvalidPlayerState,
    #[msg("Not player's turn")]
    NotPlayerTurn,
    #[msg("Betting period has ended")]
    BettingClosed,
    #[msg("Action window has expired")]
    ActionWindowExpired,
}