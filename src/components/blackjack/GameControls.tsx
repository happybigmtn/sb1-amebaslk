import React from 'react';
import { GameState } from '../../types/game';

interface GameControlsProps {
  gameState: GameState;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  onJoin: () => Promise<void>;
  onHit: () => Promise<void>;
  onStand: () => Promise<void>;
  isPlayerTurn: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  betAmount,
  setBetAmount,
  onJoin,
  onHit,
  onStand,
  isPlayerTurn,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {gameState === 'betting' && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-gray-300">Bet Amount:</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
              className="w-24 px-3 py-2 bg-gray-700 rounded-md text-white"
            />
            <span className="text-gray-400">SOL</span>
          </div>
          <button
            onClick={onJoin}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold"
          >
            Join Game
          </button>
        </div>
      )}
      
      {isPlayerTurn && (
        <div className="flex space-x-4">
          <button
            onClick={onHit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold"
          >
            Hit
          </button>
          <button
            onClick={onStand}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
          >
            Stand
          </button>
        </div>
      )}
      
      {gameState === 'dealerTurn' && (
        <div className="text-lg text-gray-300">
          Dealer's turn...
        </div>
      )}
      
      {gameState === 'settling' && (
        <div className="text-lg text-gray-300">
          Settling bets...
        </div>
      )}
    </div>
  );
};