import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { GlobalBlackjackState, PlayerState } from '../types/program';

export const useGameSubscription = (programId: PublicKey) => {
  const { connection } = useConnection();
  const [globalState, setGlobalState] = useState<GlobalBlackjackState | null>(null);
  const [players, setPlayers] = useState<PlayerState[]>([]);

  useEffect(() => {
    let accountSubscription: number;
    let programSubscription: number;

    const setupSubscriptions = async () => {
      // Subscribe to global state changes
      if (globalState?.publicKey) {
        accountSubscription = connection.onAccountChange(
          globalState.publicKey,
          (account) => {
            const decodedState = GlobalBlackjackState.decode(account.data);
            setGlobalState(decodedState);
          }
        );
      }

      // Subscribe to program account changes
      programSubscription = connection.onProgramAccountChange(
        programId,
        (account) => {
          if (account.accountInfo.data.length === PlayerState.size) {
            const decodedState = PlayerState.decode(account.accountInfo.data);
            setPlayers(prevPlayers => {
              const newPlayers = [...prevPlayers];
              const index = newPlayers.findIndex(p => 
                p.publicKey.equals(account.accountId)
              );
              if (index >= 0) {
                newPlayers[index] = decodedState;
              } else {
                newPlayers.push(decodedState);
              }
              return newPlayers;
            });
          }
        }
      );
    };

    setupSubscriptions();

    return () => {
      if (accountSubscription) {
        connection.removeAccountChangeListener(accountSubscription);
      }
      if (programSubscription) {
        connection.removeProgramAccountChangeListener(programSubscription);
      }
    };
  }, [connection, programId, globalState?.publicKey]);

  return { globalState, players };
};