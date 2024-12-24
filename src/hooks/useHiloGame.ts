import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { useGameTiming } from './useGameTiming';
import { getHiloProgram } from '../lib/programs/hilo';

type Choice = 'higher' | 'lower' | 'equal';

export const useHiloGame = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [betAmount, setBetAmount] = useState(0.1);
  const [currentCard, setCurrentCard] = useState<number>();
  const [previousCard, setPreviousCard] = useState<number>();
  const [multiplier, setMultiplier] = useState(1);
  const [players, setPlayers] = useState<any[]>([]);
  const [activePlayers, setActivePlayers] = useState(0);
  const [startBlock, setStartBlock] = useState<number>();
  const [isInGame, setIsInGame] = useState(false);
  
  const { isBettingOpen, remainingBlocks } = useGameTiming(startBlock);

  useEffect(() => {
    if (!publicKey) return;

    const program = getHiloProgram(connection);
    const subscription = program.addEventListener('GameState', (state) => {
      setStartBlock(state.startBlock);
      setCurrentCard(state.currentCard);
      setPreviousCard(state.previousCard);
      setMultiplier(state.multiplier);
      setActivePlayers(state.activePlayers);
      
      // Update players list
      program.account.hiloPlayer.all().then(accounts => {
        setPlayers(accounts.map(acc => ({
          address: acc.account.player.toString(),
          betAmount: acc.account.betAmount,
          entryMultiplier: acc.account.entryMultiplier
        })));
      });
    });

    return () => {
      program.removeEventListener(subscription);
    };
  }, [connection, publicKey]);

  const placeBet = async () => {
    if (!publicKey || !isBettingOpen) return;

    const program = getHiloProgram(connection);
    const tx = await program.methods
      .placeHiloBet(betAmount)
      .accounts({
        player: publicKey,
        // ... other accounts
      })
      .transaction();

    await sendTransaction(tx, connection);
    setIsInGame(true);
  };

  const makeChoice = async (choice: Choice) => {
    if (!publicKey || !isInGame || !currentCard) return;

    const program = getHiloProgram(connection);
    const tx = await program.methods
      .makeChoice(choice)
      .accounts({
        player: publicKey,
        // ... other accounts
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  const cashOut = async () => {
    if (!publicKey || !isInGame) return;

    const program = getHiloProgram(connection);
    const tx = await program.methods
      .cashOut()
      .accounts({
        player: publicKey,
        // ... other accounts
      })
      .transaction();

    await sendTransaction(tx, connection);
    setIsInGame(false);
  };

  return {
    currentCard,
    previousCard,
    multiplier,
    betAmount,
    setBetAmount,
    placeBet,
    makeChoice,
    cashOut,
    players,
    activePlayers,
    remainingBlocks,
    isBettingOpen,
    isInGame
  };
};