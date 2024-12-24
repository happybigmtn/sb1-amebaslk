import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MIN_BET, MAX_BET } from '../../lib/games/crash/constants';

interface BettingPanelProps {
  onPlaceBet: (amount: number, autoExit: number | null) => void;
  disabled?: boolean;
}

const BettingPanel: React.FC<BettingPanelProps> = ({ onPlaceBet, disabled }) => {
  const [betAmount, setBetAmount] = useState(MIN_BET);
  const [autoExit, setAutoExit] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBet(betAmount, autoExit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Auto Cash Out (Optional)
        </label>
        <input
          type="number"
          min={1.01}
          step={0.01}
          value={autoExit || ''}
          onChange={(e) => setAutoExit(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="Enter multiplier..."
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:opacity-50"
      >
        <span>Place Bet</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default BettingPanel;