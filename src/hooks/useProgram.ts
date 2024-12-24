import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { CasinoProgram } from '../lib/web3/program';

export const useProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet) return null;
    return new CasinoProgram(connection, wallet);
  }, [connection, wallet]);

  return program;
};