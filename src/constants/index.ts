import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export const GAME_STATES = {
  BETTING: 0,
  PLAYER_TURNS: 1,
  DEALER_TURN: 2,
  SETTLING: 3
} as const;

export const PLAYER_STATUS = {
  BETTING: 0,
  ACTIVE: 1,
  STANDING: 2,
  BUST: 3,
  BLACKJACK: 4
} as const;