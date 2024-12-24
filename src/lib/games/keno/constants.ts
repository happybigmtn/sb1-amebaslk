// Payout multipliers based on number of spots selected and hits
export const PAYOUTS: Record<number, number[]> = {
  1: [3.8],
  2: [1, 9],
  3: [0, 2.7, 32],
  4: [0, 1.7, 5.9, 90],
  5: [0, 1.4, 3, 14, 200],
  6: [0, 1.2, 2, 4.5, 24, 400],
  7: [0, 1, 1.5, 2.5, 7, 50, 750],
  8: [0, 0.8, 1.3, 2, 4.5, 12, 100, 1200],
  9: [0, 0.5, 1, 1.5, 2.5, 6, 22, 150, 2000],
  10: [0, 0.3, 0.8, 1.2, 2, 4, 10, 40, 250, 3000]
};

export const MAX_SELECTED_NUMBERS = 10;
export const NUMBERS_DRAWN = 20;
export const ROUND_SPACING = 15; // blocks between draws