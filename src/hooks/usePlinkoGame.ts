import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { useGameTiming } from './useGameTiming';
import { getPlinkoProgram } from '../lib/programs/plinko';

export const usePlinkoGame = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [betAmount, setBetAmount] = useState(0.1);
  const [currentPath, setCurrentPath] = useState<boolean[]>();
  const [startBlock, setStartBlock] = useState<number>();
  
  const { isBettingOpen, remainingBlocks } = useGameTiming(startBlock);

  useEffect(() => {
    if (!publicKey) return;

    const program = getPlinkoProgram(connection);
    const subscription = program.addEventListener('GameState', (state) => {
      setStartBlock(state.startBlock);
      if (state.currentBall) {
        setCurrentPath(state.currentBall.directions);
      }
    });

    return () => {
      program.removeEventListener(subscription);
    };
  }, [connection, publicKey]);

  const placeBet = async (risk: 'low' | 'medium' | 'high') => {
    if (!publicKey || !isBettingOpen) return;

    const program = getPlinkoProgram(connection);
    const tx = await program.methods
      .placePlinkoBet(betAmount, risk)
      .accounts({
        player: publicKey,
        // ... other accounts
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  return {
    currentPath,
    betAmount,
    setBetAmount,
    placeBet,
    remainingBlocks,
    isBettingOpen
  };
};