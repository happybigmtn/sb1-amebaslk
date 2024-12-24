// Common types used across games
export interface GameState {
  roundActive: boolean;
  totalBets: number;
  totalPlayers: number;
  startBlock: number;
  nextRoundBlock: number;
}

export interface PlayerState {
  betAmount: number;
  timestamp: number;
  settled: boolean;
}