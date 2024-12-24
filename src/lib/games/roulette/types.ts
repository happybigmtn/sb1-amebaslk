export type BetType = 
  | 'straight'    // Single number
  | 'split'       // Two adjacent numbers
  | 'street'      // Three numbers in a row
  | 'corner'      // Four adjacent numbers
  | 'line'        // Six numbers (two rows)
  | 'column'      // Twelve numbers (vertical)
  | 'dozen'       // Twelve numbers (1-12, 13-24, 25-36)
  | 'red'         // Red numbers
  | 'black'       // Black numbers
  | 'even'        // Even numbers
  | 'odd'         // Odd numbers
  | 'low'         // 1-18
  | 'high';       // 19-36

export interface Bet {
  type: BetType;
  numbers: number[];
  amount: number;
}

export interface SpinResult {
  number: number;
  color: 'red' | 'black' | 'green';
}

export const PAYOUTS: Record<BetType, number> = {
  straight: 35,
  split: 17,
  street: 11,
  corner: 8,
  line: 5,
  column: 2,
  dozen: 2,
  red: 1,
  black: 1,
  even: 1,
  odd: 1,
  low: 1,
  high: 1
};