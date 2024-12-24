import { PublicKey } from '@solana/web3.js';

export type GameState = 'betting' | 'playing' | 'dealerTurn' | 'settling';

export type PlayerStatus = 'Betting' | 'Active' | 'Standing' | 'Bust' | 'Blackjack';

export interface PlayerInfo {
  publicKey: PublicKey;
  betAmount: number;
  status: PlayerStatus;
  score?: number;
}

export interface Card {
  rank: number;
  suit: number;
  faceUp: boolean;
}

export interface Hand {
  cards: Card[];
  value: number;
}