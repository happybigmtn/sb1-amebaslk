import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { PlayerState } from '../../lib/games/shared/types';

export const usePlayerState = <T extends PlayerState>(programId: string) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [playerState, setPlayerState] = useState<T | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    // Subscribe to player state changes
    // Implementation will vary based on the specific program
  }, [connection, publicKey]);

  return playerState;
};