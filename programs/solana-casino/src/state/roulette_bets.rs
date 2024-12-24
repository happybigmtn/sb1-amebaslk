use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetType {
    Straight(u8),          // Single number
    Split(u8, u8),         // Two adjacent numbers
    Street(u8),            // Three numbers in a row
    Corner(u8),            // Four adjacent numbers
    Line(u8),              // Six numbers (two rows)
    Column(u8),            // Twelve numbers (vertical)
    Dozen(u8),             // 1-12, 13-24, 25-36
    Red,                   // Red numbers
    Black,                 // Black numbers
    Even,                  // Even numbers
    Odd,                   // Odd numbers
    Low,                   // 1-18
    High,                  // 19-36
    Voisins,              // Voisins du Zero
    Tiers,                // Tiers du Cylindre
    Orphelins,            // Orphelins
}

impl BetType {
    pub fn get_payout_multiplier(&self) -> u64 {
        match self {
            BetType::Straight(_) => 35,
            BetType::Split(_, _) => 17,
            BetType::Street(_) => 11,
            BetType::Corner(_) => 8,
            BetType::Line(_) => 5,
            BetType::Column(_) | BetType::Dozen(_) => 2,
            BetType::Red | BetType::Black |
            BetType::Even | BetType::Odd |
            BetType::Low | BetType::High => 1,
            BetType::Voisins => 17, // Average payout
            BetType::Tiers => 17,   // Average payout
            BetType::Orphelins => 17, // Average payout
        }
    }

    pub fn is_winning_bet(&self, result: u8) -> bool {
        match self {
            BetType::Straight(n) => *n == result,
            BetType::Split(n1, n2) => *n1 == result || *n2 == result,
            BetType::Street(row) => {
                let start = row * 3;
                result >= start && result < start + 3
            },
            BetType::Corner(n) => {
                let corners = [*n, n + 1, n + 3, n + 4];
                corners.contains(&result)
            },
            BetType::Line(row) => {
                let start = row * 3;
                result >= start && result < start + 6
            },
            BetType::Column(col) => result % 3 == *col,
            BetType::Dozen(d) => {
                let start = d * 12;
                result > start && result <= start + 12
            },
            BetType::Red => RED_NUMBERS.contains(&result),
            BetType::Black => BLACK_NUMBERS.contains(&result),
            BetType::Even => result != 0 && result % 2 == 0,
            BetType::Odd => result % 2 == 1,
            BetType::Low => result >= 1 && result <= 18,
            BetType::High => result >= 19 && result <= 36,
            BetType::Voisins => VOISINS.contains(&result),
            BetType::Tiers => TIERS.contains(&result),
            BetType::Orphelins => ORPHELINS.contains(&result),
        }
    }
}