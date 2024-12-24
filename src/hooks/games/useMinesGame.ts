import { useState, useEffect } from 'react';
import { useProgram } from '../useProgram';
import { MinesConfig } from '../../types/games/mines';
import { calculateMultiplier } from '../../lib/games/mines/utils';

export const useMinesGame = () => {
  const program = useProgram();
  
  const [gameActive, setGameActive] = useState(false);
  const [gridSize, setGridSize] = useState(5);
  const [mineCount, setMineCount] = useState(3);
  const [betAmount, setBetAmount] = useState(0);
  const [revealedCells, setRevealedCells] = useState<boolean[]>([]);
  const [mineLocations, setMineLocations] = useState<number[]>();
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program) return;

    const subscription = program.onPlayerStateChange((state) => {
      if (!state) return;
      
      setRevealedCells(state.revealedCells);
      setMineLocations(state.mineLocations);
      setGameActive(!state.settled);
      
      // Calculate current multiplier
      const revealedCount = state.revealedCells.filter(Boolean).length;
      setCurrentMultiplier(calculateMultiplier(state.mineCount, revealedCount));
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [program]);

  const startGame = async (config: MinesConfig) => {
    if (!program) return;

    setLoading(true);
    setError(null);

    try {
      await program.startMinesGame(config);
      setGridSize(config.gridSize);
      setMineCount(config.mineCount);
      setBetAmount(config.betAmount);
      setGameActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const revealCell = async (index: number) => {
    if (!program || !gameActive || revealedCells[index]) return;

    setLoading(true);
    setError(null);

    try {
      await program.revealCell(index);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reveal cell');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cashout = async () => {
    if (!program || !gameActive) return;

    setLoading(true);
    setError(null);

    try {
      await program.cashoutMines();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cash out');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    gameActive,
    gridSize,
    mineCount,
    revealedCells,
    mineLocations,
    currentMultiplier,
    loading,
    error,
    startGame,
    revealCell,
    cashout
  };
};