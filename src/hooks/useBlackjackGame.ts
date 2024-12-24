import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { useGameTiming } from './useGameTiming';
import { getBlackjackProgram } from '../lib/programs';
import { Card, GameState } from '../types/game';

export const useBlackjackGame = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [gameState, setGameState] = useState<GameState>('betting');
  const [startBlock, setStartBlock] = useState<number>();
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  
  const { isBettingOpen, isActionPhase } = useGameTiming(startBlock);

  // Subscribe to game state
  useEffect(() => {
    if (!publicKey) return;

    const program = getBlackjackProgram(connection);
    const subscription = program.addEventListener('GameState', (state) => {
      setStartBlock(state.bettingStartBlock);
      setGameState(state.gameStatus);
      setPlayerCards(state.playerCards);
      setDealerCards(state.dealerCards);
    });

    return () => {
      program.removeEventListener(subscription);
    };
  }, [connection, publicKey]);

  const hit = async () => {
    if (!publicKey || !isActionPhase) return;

    const program = getBlackjackProgram(connection);
    const tx = await program.methods
      .hit()
      .accounts({
        player: publicKey,
        // ... other accounts
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  // ... other game actions

  return {
    gameState,
    playerCards,
    dealerCards,
    isBettingOpen,
    isActionPhase,
    hit,
    // ... other actions
  };
};