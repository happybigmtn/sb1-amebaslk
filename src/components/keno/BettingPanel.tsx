import React from 'react';
import { Clock } from 'lucide-react';
import { PAYOUTS } from '../../lib/games/keno/constants';

interface BettingPanelProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  selectedCount: number;
  onPlaceBet: () => void;
  disabled?: boolean;
  nextDrawBlock?: number;
}

const BettingPanel: React.FC<BettingPanelProps> = ({
  betAmount,
  setBetAmount,
  selectedCount,
  onPlaceBet,
  disabled,
  nextDrawBlock
}) => {
  const maxPayout = selectedCount > 0 ? PAYOUTS[selectedCount - 1] : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Bet Amount
          </label>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
            disabled={disabled}
          />
        </div>

        <div>
          <div className="text-sm font-medium text-gray-400 mb-1">
            Potential Win
          </div>
          <div className="px-3 py-2 bg-gray-700 rounded-md">
            {(betAmount * maxPayout).toFixed(2)} SOL
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Selected: {selectedCount} numbers
        </div>
        {nextDrawBlock && (
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            Next draw in {nextDrawBlock} blocks
          </div>
        )}
      </div>

      <button
        onClick={onPlaceBet}
        disabled={disabled || selectedCount === 0}
        className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:opacity-50"
      >
        Place Bet
      </button>
    </div>
  );
};

export default BettingPanel;