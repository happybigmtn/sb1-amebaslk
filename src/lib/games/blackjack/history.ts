import { Hand } from '../../types/card';

export interface HandResult {
  playerHands: Hand[];
  dealerHand: Hand;
  betAmount: number;
  result: 'win' | 'lose' | 'push' | 'blackjack';
  payout: number;
  timestamp: number;
}

export class HandHistory {
  private history: HandResult[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  add(result: HandResult) {
    this.history.unshift(result);
    if (this.history.length > this.maxSize) {
      this.history.pop();
    }
  }

  getAll(): HandResult[] {
    return [...this.history];
  }

  getLast(count: number): HandResult[] {
    return this.history.slice(0, count);
  }

  clear() {
    this.history = [];
  }
}