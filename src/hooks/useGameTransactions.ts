import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  createJoinGameInstruction, 
  createHitInstruction, 
  createStandInstruction 
} from '../utils/instructions';
import { PROGRAM_ID } from '../constants';

export const useGameTransactions = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const joinGame = useCallback(async (betAmount: number) => {
    if (!publicKey) return;

    const playerState = PublicKey.unique();
    const globalState = await PublicKey.findProgramAddress(
      [Buffer.from('global_state')],
      PROGRAM_ID
    )[0];

    const transaction = new Transaction().add(
      createJoinGameInstruction(
        publicKey,
        playerState,
        globalState,
        betAmount * LAMPORTS_PER_SOL
      )
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }, [connection, publicKey, sendTransaction]);

  const hit = useCallback(async () => {
    if (!publicKey) return;

    const [globalState, playerState, vrf] = await Promise.all([
      PublicKey.findProgramAddress([Buffer.from('global_state')], PROGRAM_ID)[0],
      PublicKey.findProgramAddress([publicKey.toBuffer()], PROGRAM_ID)[0],
      PublicKey.findProgramAddress([Buffer.from('vrf')], PROGRAM_ID)[0],
    ]);

    const transaction = new Transaction().add(
      createHitInstruction(publicKey, playerState, globalState, vrf)
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error hitting:', error);
      throw error;
    }
  }, [connection, publicKey, sendTransaction]);

  const stand = useCallback(async () => {
    if (!publicKey) return;

    const [globalState, playerState] = await Promise.all([
      PublicKey.findProgramAddress([Buffer.from('global_state')], PROGRAM_ID)[0],
      PublicKey.findProgramAddress([publicKey.toBuffer()], PROGRAM_ID)[0],
    ]);

    const transaction = new Transaction().add(
      createStandInstruction(publicKey, playerState, globalState)
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error standing:', error);
      throw error;
    }
  }, [connection, publicKey, sendTransaction]);

  return {
    joinGame,
    hit,
    stand
  };
};