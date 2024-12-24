use anchor_lang::prelude::*;
use crate::state::global_blackjack::*;

#[derive(Accounts)]
pub struct StartNewRound<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalBlackjackState>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn start_new_round(ctx: Context<StartNewRound>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let clock = Clock::get()?;

    global_state.round_number += 1;
    global_state.betting_start_block = clock.slot;
    global_state.betting_end_block = clock.slot + 15;
    global_state.game_status = GlobalGameStatus::BettingOpen;
    global_state.dealer_cards.clear();
    global_state.dealer_score = 0;
    global_state.total_pot = 0;
    global_state.player_count = 0;

    Ok(())
}