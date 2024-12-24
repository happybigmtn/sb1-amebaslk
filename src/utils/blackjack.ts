import { Card, Hand, Rank } from '../types/card';

export const calculateHandValue = (cards: Card[]): number => {
  let value = 0;
  let aces = 0;

  cards.forEach(card => {
    if (!card.faceUp) return;

    if (card.rank === 'A') {
      aces += 1;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  });

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

export const isBust = (hand: Hand): boolean => hand.value > 21;

export const isBlackjack = (hand: Hand): boolean => 
  hand.cards.length === 2 && hand.value === 21;