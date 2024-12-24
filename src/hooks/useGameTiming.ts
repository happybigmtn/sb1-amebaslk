import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';

export const BETTING_WINDOW = 15; // 15 blocks
export const ACTION_WINDOW = 15; // 15 blocks for player actions

export const useGameTiming = (startBlock?: number) => {
  const { connection } = useConnection();
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [remainingBlocks, setRemainingBlocks] = useState<number>(0);

  useEffect(() => {
    let subscription: number;

    const setupSubscription = async () => {
      // Get initial slot
      const slot = await connection.getSlot();
      setCurrentSlot(slot);
      
      if (startBlock) {
        setRemainingBlocks(Math.max(0, startBlock + BETTING_WINDOW - slot));
      }

      // Subscribe to slot changes
      subscription = connection.onSlotChange(({ slot }) => {
        setCurrentSlot(slot);
        if (startBlock) {
          setRemainingBlocks(Math.max(0, startBlock + BETTING_WINDOW - slot));
        }
      });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        connection.removeSlotChangeListener(subscription);
      }
    };
  }, [connection, startBlock]);

  const isBettingOpen = startBlock ? currentSlot <= startBlock + BETTING_WINDOW : false;
  const isActionPhase = startBlock ? 
    currentSlot > startBlock + BETTING_WINDOW && 
    currentSlot <= startBlock + BETTING_WINDOW + ACTION_WINDOW : 
    false;

  return {
    currentSlot,
    remainingBlocks,
    isBettingOpen,
    isActionPhase
  };
};