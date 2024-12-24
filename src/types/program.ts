import { PublicKey } from '@solana/web3.js';
import * as borsh from 'borsh';

export class GlobalBlackjackState {
  static size = 1024;

  constructor(
    public bettingStartBlock: number,
    public bettingEndBlock: number,
    public dealerCards: number[],
    public dealerScore: number,
    public gameStatus: number,
    public roundNumber: number,
    public totalPot: number,
    public minBet: number,
    public maxBet: number,
    public playerCount: number,
    public publicKey: PublicKey
  ) {}

  static decode(data: Buffer): GlobalBlackjackState {
    // Implement borsh deserialization
    return borsh.deserialize(
      GlobalBlackjackState.schema,
      GlobalBlackjackState,
      data
    );
  }

  static schema = new Map([
    [GlobalBlackjackState, {
      kind: 'struct',
      fields: [
        ['bettingStartBlock', 'u64'],
        ['bettingEndBlock', 'u64'],
        ['dealerCards', ['u8']],
        ['dealerScore', 'u8'],
        ['gameStatus', 'u8'],
        ['roundNumber', 'u64'],
        ['totalPot', 'u64'],
        ['minBet', 'u64'],
        ['maxBet', 'u64'],
        ['playerCount', 'u32'],
        ['publicKey', [32]]
      ]
    }]
  ]);
}

export class PlayerState {
  static size = 512;

  constructor(
    public player: PublicKey,
    public cards: number[],
    public score: number,
    public betAmount: number,
    public joinBlock: number,
    public roundNumber: number,
    public status: number,
    public actionTaken: boolean,
    public publicKey: PublicKey
  ) {}

  static decode(data: Buffer): PlayerState {
    // Implement borsh deserialization
    return borsh.deserialize(
      PlayerState.schema,
      PlayerState,
      data
    );
  }

  static schema = new Map([
    [PlayerState, {
      kind: 'struct',
      fields: [
        ['player', [32]],
        ['cards', ['u8']],
        ['score', 'u8'],
        ['betAmount', 'u64'],
        ['joinBlock', 'u64'],
        ['roundNumber', 'u64'],
        ['status', 'u8'],
        ['actionTaken', 'bool'],
        ['publicKey', [32]]
      ]
    }]
  ]);
}