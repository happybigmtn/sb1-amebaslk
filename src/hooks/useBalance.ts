import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getBalanceProgram } from '../lib/programs';

export const useBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [ubiBalance, setUbiBalance] = useState(0);
  const [fmBalance, setFmBalance] = useState(1000); // Start with 1000 FM

  useEffect(() => {
    if (!publicKey) return;

    const program = getBalanceProgram(connection);
    const subscription = program.addEventListener('BalanceChange', (balance) => {
      setUbiBalance(balance.ubiAmount);
      setFmBalance(balance.fmAmount);
    });

    // Initial balance fetch
    program.account.balance.fetch(publicKey).then((balance) => {
      setUbiBalance(balance.ubiAmount);
      setFmBalance(balance.fmAmount);
    });

    return () => {
      program.removeEventListener(subscription);
    };
  }, [connection, publicKey]);

  return {
    ubiBalance,
    fmBalance
  };
};