import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { DicePrediction, DiceResult } from '../types/dice';

export const useDiceGame = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  const [currentRoll, setCurrentRoll] = useState<number>();
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<DiceResult[]>([]);

  useEffect(() => {
    if (!publicKey) return;

    // Subscribe to game state
    // This would be implemented with your actual program subscription
  }, [connection, publicKey]);

  const placeBet = async (
    amount: number,
    prediction: DicePrediction,
    targetValue?: number
  ) => {
    if (!publicKey) return;

    setRolling(true);
    try {
      // Place bet using program
      // For now, simulate the roll
      await new Promise(resolve => setTimeout(resolve, 2000));
      const roll = Math.floor(Math.random() * 6) + 1;
      setCurrentRoll(roll);
      
      // Calculate payout based on prediction
      let payout = 0;
      if (prediction === 'over' && roll > 3) payout = amount * 2;
      if (prediction === 'under' && roll < 4) payout = amount * 2;
      if (prediction === 'exact' && roll === targetValue) payout = amount * 6;

      // Add to history
      setHistory(prev => [{
        roll,
        prediction,
        targetValue,
        amount,
        payout,
        timestamp: Date.now()
      }, ...prev]);

    } finally {
      setRolling(false);
    }
  };

  return {
    currentRoll,
    rolling,
    placeBet,
    history
  };
};