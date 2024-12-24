export interface CrashGameState {
  startBlock: number;
  nextRoundBlock: number;
  currentMultiplier: number;
  crashPoint: number | null;
  roundActive: boolean;
  totalBets: number;
  totalPlayers: number;
}

export interface CrashPlayerState {
  betAmount: number;
  autoExitMultiplier: number | null;
  exitMultiplier: number | null;
  exited: boolean;
}

export interface CrashBet {
  player: string;
  amount: number;
  autoExitMultiplier: number | null;
  timestamp: number;
}