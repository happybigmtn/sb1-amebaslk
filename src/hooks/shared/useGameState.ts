import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { GameState } from '../../lib/games/shared/types';

export const useGameState = <T extends GameState>(programId: string) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [gameState, setGameState] = useState<T | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    // Subscribe to game state changes
    // Implementation will vary based on the specific program
  }, [connection, publicKey]);

  return gameState;
};