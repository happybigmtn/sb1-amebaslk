import React, { useState } from 'react';
import { GRID_SIZES, MINE_COUNTS, MIN_BET, MAX_BET } from '../../../lib/games/mines/constants';

interface GameControlsProps {
  onStart: (config: { gridSize: number; mineCount: number; betAmount: number }) => void;
  onCashout: () => void;
  gameActive: boolean;
  currentMultiplier: number;
  disabled?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onStart,
  onCashout,
  gameActive,
  currentMultiplier,
  disabled
}) => {
  const [gridSize, setGridSize] = useState(5);
  const [mineCount, setMineCount] = useState(3);
  const [betAmount, setBetAmount] = useState(MIN_BET);

  return (
    <div className="space-y-6">
      {!gameActive ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Grid Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRID_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`py-2 rounded-md font-semibold
                    ${gridSize === size
                      ? 'bg-indigo-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Number of Mines
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MINE_COUNTS.map(count => (
                <button
                  key={count}
                  onClick={() => setMineCount(count)}
                  className={`py-2 rounded-md font-semibold
                    ${mineCount === count
                      ? 'bg-indigo-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Bet Amount
            </label>
            <input
              type="number"
              min={MIN_BET}
              max={MAX_BET}
              step={0.1}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 rounded-md"
              disabled={disabled}
            />
          </div>

          <button
            onClick={() => onStart({ gridSize, mineCount, betAmount })}
            disabled={disabled}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold disabled:opacity-50"
          >
            Start Game
          </button>
        </>
      ) : (
        <button
          onClick={onCashout}
          disabled={disabled}
          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold disabled:opacity-50"
        >
          Cash Out ({currentMultiplier.toFixed(2)}x)
        </button>
      )}
    </div>
  );
};

export default GameControls;