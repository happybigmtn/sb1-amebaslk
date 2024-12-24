import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import MinesGrid from '../components/games/mines/MinesGrid';
import GameControls from '../components/games/mines/GameControls';
import GameChat from '../components/chat/GameChat';
import { useMinesGame } from '../hooks/games/useMinesGame';
import TestPanel from '../components/test/TestPanel';

const Mines = () => {
  const { connected } = useWallet();
  const {
    gameActive,
    gridSize,
    revealedCells,
    mineLocations,
    currentMultiplier,
    startGame,
    revealCell,
    cashout
  } = useMinesGame();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Mines</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mines</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-gray-800 p-8 rounded-lg">
            <MinesGrid
              gridSize={gridSize}
              revealedCells={revealedCells}
              mineLocations={gameActive ? undefined : mineLocations}
              onCellClick={revealCell}
              disabled={!gameActive}
            />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <GameControls
              onStart={startGame}
              onCashout={cashout}
              gameActive={gameActive}
              currentMultiplier={currentMultiplier}
            />
          </div>
        </div>
        
        <div>
          <GameChat gameRoom="mines" />
        </div>
      </div>
      
      <TestPanel />
    </div>
  );
};

export default Mines;