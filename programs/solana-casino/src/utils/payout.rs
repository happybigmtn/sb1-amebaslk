pub fn calculate_payout(bet_amount: u64, player_score: u8, dealer_score: u8) -> u64 {
    if player_score > 21 {
        return 0;
    }

    if dealer_score > 21 || player_score > dealer_score {
        if player_score == 21 && player_score == 2 {
            // Blackjack pays 3:2
            return bet_amount + (bet_amount * 3 / 2);
        }
        // Regular win pays 1:1
        return bet_amount * 2;
    }

    if player_score == dealer_score {
        // Push returns original bet
        return bet_amount;
    }

    // Loss returns nothing
    0
}