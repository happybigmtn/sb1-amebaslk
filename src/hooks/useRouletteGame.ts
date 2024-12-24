import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { useGameTiming } from './useGameTiming';
import { getRouletteProgram } from '../lib/programs';
import { BetType, SpinResult } from '../lib/games/roulette/types';

export const useRouletteGame = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [startBlock, setStartBlock] = useState<number>();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult>();
  
  const { isBettingOpen, remainingBlocks } = useGameTiming(startBlock);

  // Subscribe to game state
  useEffect(() => {
    if (!publicKey) return;

    const program = getRouletteProgram(connection);
    const subscription = program.addEventListener('GameState', (state) => {
      setStartBlock(state.bettingStartBlock);
      if (state.lastSpin > 0) {
        setResult({
          number: state.lastNumber,
          color: getNumberColor(state.lastNumber)
        });
      }
    });

    return () => {
      program.removeEventListener(subscription);
    };
  }, [connection, publicKey]);

  const placeBet = async (betType: BetType, amount: number) => {
    if (!publicKey || !isBettingOpen) return;

    const program = getRouletteProgram(connection);
    const tx = await program.methods
      .placeBet(betType, amount)
      .accounts({
        player: publicKey,
        // ... other accounts
      })
      .transaction();

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature);
  };

  return {
    spinning,
    result,
    isBettingOpen,
    remainingBlocks,
    placeBet
  };
};