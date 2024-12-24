use anchor_lang::prelude::*;
use crate::state::global_blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct DealerTurn<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalBlackjackState>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn execute_dealer_turn(ctx: Context<DealerTurn>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    
    require!(
        global_state.game_status == GlobalGameStatus::PlayerTurns,
        CasinoError::InvalidGameState
    );

    // Check if all players have acted or time window expired
    let clock = Clock::get()?;
    let action_deadline = global_state.betting_end_block + 15; // 15 blocks for actions
    
    require!(
        clock.slot >= action_deadline || all_players_acted(global_state),
        CasinoError::ActionWindowNotExpired
    );

    global_state.game_status = GlobalGameStatus::DealerTurn;
    
    // Draw dealer cards until 17 or higher
    while global_state.dealer_score < 17 {
        // TODO: Implement VRF card drawing
        // draw_card_for_dealer(global_state);
    }

    global_state.game_status = GlobalGameStatus::Settling;
    
    Ok(())
}