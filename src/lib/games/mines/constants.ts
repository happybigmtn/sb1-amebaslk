export const GRID_SIZES = [5, 6, 7] as const;
export const MINE_COUNTS = [1, 3, 5, 10, 15, 24] as const;

export const MIN_BET = 0.1;
export const MAX_BET = 100;
export const ROUND_SPACING = 15; // blocks between rounds

export const MULTIPLIERS: Record<number, number[]> = {
  1: [1.08, 1.17, 1.27, 1.38, 1.51, 1.65, 1.82, 2.01, 2.23, 2.49, 2.81, 3.19],
  3: [1.31, 1.75, 2.39, 3.34, 4.78, 7.05, 10.8, 17.2, 29.0, 52.3, 104, 244],
  5: [1.65, 2.85, 5.17, 9.92, 20.2, 44.4, 107, 289, 904, 3520, 18800],
  10: [3.17, 10.8, 40.8, 172, 824, 4570, 30500],
  15: [7.25, 59.0, 573, 7040],
  24: [104, 11400]
};