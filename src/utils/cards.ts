export const calculateHandValue = (cards: Card[]): number => {
  let value = 0;
  let aces = 0;

  cards.forEach(card => {
    if (!card.faceUp) return;

    if (card.rank === 0) { // Ace
      aces += 1;
      value += 11;
    } else if (card.rank >= 10) { // Face cards
      value += 10;
    } else {
      value += card.rank + 1;
    }
  });

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};