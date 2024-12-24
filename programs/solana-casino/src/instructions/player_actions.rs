use anchor_lang::prelude::*;
use crate::state::global_blackjack::*;
use crate::utils::{cards::*, game_checks::*, vrf::*};
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct PlayerAction<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalBlackjackState>,
    #[account(
        mut,
        constraint = player_state.player == player.key(),
        constraint = player_state.round_number == global_state.round_number
    )]
    pub player_state: Account<'info, PlayerState>,
    pub player: Signer<'info>,
    /// VRF Accounts
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub switchboard_program: AccountInfo<'info>,
}

pub fn hit(ctx: Context<PlayerAction>) -> Result<()> {
    let global_state = &ctx.accounts.global_state;
    let player_state = &mut ctx.accounts.player_state;
    let clock = Clock::get()?;

    require!(
        global_state.game_status == GlobalGameStatus::PlayerTurns,
        CasinoError::InvalidGameState
    );

    require!(
        clock.slot <= global_state.betting_end_block + 15,
        CasinoError::ActionWindowExpired
    );

    require!(
        !player_state.action_taken,
        CasinoError::InvalidPlayerState
    );

    // Draw card using VRF
    let card = get_random_card(&ctx.accounts.vrf)?;
    let card = Card::from_index(card, true);
    
    player_state.cards.push(card);
    player_state.score = calculate_hand_value(&player_state.cards);

    if is_bust(&player_state.cards) {
        player_state.status = PlayerStatus::Bust;
        player_state.action_taken = true;
    }

    Ok(())
}

pub fn stand(ctx: Context<PlayerAction>) -> Result<()> {
    let global_state = &ctx.accounts.global_state;
    let player_state = &mut ctx.accounts.player_state;
    let clock = Clock::get()?;

    require!(
        global_state.game_status == GlobalGameStatus::PlayerTurns,
        CasinoError::InvalidGameState
    );

    require!(
        clock.slot <= global_state.betting_end_block + 15,
        CasinoError::ActionWindowExpired
    );

    require!(
        !player_state.action_taken,
        CasinoError::InvalidPlayerState
    );

    player_state.status = PlayerStatus::Standing;
    player_state.action_taken = true;

    Ok(())
}