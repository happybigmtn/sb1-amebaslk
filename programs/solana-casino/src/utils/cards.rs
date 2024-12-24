use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub struct Card {
    pub rank: u8, // 0-12 (Ace=0, 2=1, ..., King=12)
    pub suit: u8, // 0-3 (Hearts=0, Diamonds=1, Clubs=2, Spades=3)
    pub face_up: bool,
}

impl Card {
    pub fn from_index(index: u8, face_up: bool) -> Self {
        Self {
            rank: index % 13,
            suit: index / 13,
            face_up,
        }
    }

    pub fn value(&self) -> u8 {
        match self.rank {
            0 => 11, // Ace
            10 | 11 | 12 => 10, // Face cards
            n => n + 1, // Number cards
        }
    }
}

pub fn calculate_hand_value(cards: &[Card]) -> u8 {
    let mut value = 0;
    let mut aces = 0;

    for card in cards {
        if !card.face_up {
            continue;
        }

        if card.rank == 0 {
            aces += 1;
            value += 11;
        } else {
            value += card.value();
        }
    }

    // Adjust for aces
    while value > 21 && aces > 0 {
        value -= 10;
        aces -= 1;
    }

    value
}