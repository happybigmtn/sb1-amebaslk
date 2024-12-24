import { Hand } from '../../types/card';

type Action = 'hit' | 'stand' | 'double' | 'split';

export const getBasicStrategy = (
  playerHand: Hand,
  dealerUpCard: number
): Action => {
  const total = playerHand.value;
  const hasAce = playerHand.cards.some(card => card.rank === 'A');
  const isPair = playerHand.cards.length === 2 && 
    playerHand.cards[0].rank === playerHand.cards[1].rank;

  if (isPair) {
    // Pair splitting strategy
    if (['A', '8'].includes(playerHand.cards[0].rank)) return 'split';
    if (playerHand.cards[0].rank === '7' && dealerUpCard <= 7) return 'split';
  }

  if (hasAce && total <= 21) {
    // Soft totals strategy
    if (total >= 19) return 'stand';
    if (total === 18 && dealerUpCard >= 9) return 'hit';
    if (total <= 17) return 'hit';
  }

  // Hard totals strategy
  if (total >= 17) return 'stand';
  if (total <= 11) return 'hit';
  if (total === 12 && dealerUpCard >= 4 && dealerUpCard <= 6) return 'stand';
  
  return 'hit';
};