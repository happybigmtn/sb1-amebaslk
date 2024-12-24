export interface KenoResult {
  selectedNumbers: number[];
  drawnNumbers: number[];
  hits: number;
  betAmount: number;
  payout: number;
  timestamp: number;
}

export interface KenoGameState {
  startBlock: number;
  nextDrawBlock: number;
  drawnNumbers: number[];
  roundActive: boolean;
  totalBets: number;
  totalPlayers: number;
}

export interface KenoPlayerState {
  selectedNumbers: number[];
  betAmount: number;
  settled: boolean;
}