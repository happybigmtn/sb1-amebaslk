import { PublicKey } from '@solana/web3.js';

export interface MinesGameState {
  startBlock: number;
  nextRoundBlock: number;
  roundActive: boolean;
  totalBets: number;
  totalPlayers: number;
  gridSize: number;
  mineCount: number;
}

export interface MinesPlayerState {
  player: PublicKey;
  betAmount: number;
  grid: boolean[];
  revealedCells: boolean[];
  mineLocations?: number[];
  cashoutMultiplier?: number;
  active: boolean;
  timestamp: number;
}

export interface MinesConfig {
  gridSize: number;
  mineCount: number;
  betAmount: number;
}