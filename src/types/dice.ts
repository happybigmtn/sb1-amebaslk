export type DicePrediction = 'over' | 'under' | 'exact';

export interface DiceResult {
  roll: number;
  prediction: DicePrediction;
  targetValue?: number;
  amount: number;
  payout: number;
  timestamp: number;
}