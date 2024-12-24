pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use anchor_lang::prelude::*;
use instructions::{
    global_blackjack::*,
    dealer_turn::*,
    settlement::*,
    start_new_round::*,
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_casino {
    use super::*;

    pub fn initialize_global_game(ctx: Context<InitializeGlobalGame>) -> Result<()> {
        instructions::global_blackjack::initialize_global_game(ctx)
    }

    pub fn join_game(ctx: Context<JoinGame>, bet_amount: u64) -> Result<()> {
        instructions::global_blackjack::join_game(ctx, bet_amount)
    }

    pub fn hit(ctx: Context<PlayerAction>) -> Result<()> {
        instructions::player_actions::hit(ctx)
    }

    pub fn stand(ctx: Context<PlayerAction>) -> Result<()> {
        instructions::player_actions::stand(ctx)
    }

    pub fn execute_dealer_turn(ctx: Context<DealerTurn>) -> Result<()> {
        instructions::dealer_turn::execute_dealer_turn(ctx)
    }

    pub fn settle_player(ctx: Context<SettlePlayer>) -> Result<()> {
        instructions::settlement::settle_player(ctx)
    }

    pub fn start_new_round(ctx: Context<StartNewRound>) -> Result<()> {
        instructions::start_new_round::start_new_round(ctx)
    }
}