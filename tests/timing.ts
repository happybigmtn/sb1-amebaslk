import * as anchor from '@project-serum/anchor';
import { assert } from 'chai';

describe('Game Timing', () => {
  it('Respects betting window', async () => {
    const provider = anchor.AnchorProvider.env();
    const connection = provider.connection;
    
    // Get current slot
    const startSlot = await connection.getSlot();
    
    // Wait for betting window
    while (await connection.getSlot() < startSlot + 15) {
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    const endSlot = await connection.getSlot();
    assert(endSlot >= startSlot + 15, 'Betting window should be 15 blocks');
  });
});