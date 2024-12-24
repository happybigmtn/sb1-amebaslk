use anchor_lang::prelude::*;
use crate::state::global_blackjack::*;

pub fn all_players_acted(global_state: &GlobalBlackjackState) -> bool {
    global_state.player_count > 0 && 
    global_state.players_acted_count == global_state.player_count
}

pub fn is_blackjack(cards: &[Card]) -> bool {
    cards.len() == 2 && calculate_hand_value(cards) == 21
}

pub fn is_bust(cards: &[Card]) -> bool {
    calculate_hand_value(cards) > 21
}