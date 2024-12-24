import { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';

export const useBlockTimer = (endBlock: number) => {
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [remainingBlocks, setRemainingBlocks] = useState<number>(0);
  
  useEffect(() => {
    const connection = new Connection('http://localhost:8899', 'confirmed');
    
    const updateBlockHeight = async () => {
      const slot = await connection.getSlot();
      setCurrentBlock(slot);
      setRemainingBlocks(Math.max(0, endBlock - slot));
    };

    const interval = setInterval(updateBlockHeight, 1000);
    updateBlockHeight();

    return () => clearInterval(interval);
  }, [endBlock]);

  return {
    currentBlock,
    remainingBlocks,
    isExpired: remainingBlocks <= 0
  };
};