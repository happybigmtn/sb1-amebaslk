import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Target } from 'lucide-react';
import { DicePrediction } from '../../types/dice';

interface BettingPanelProps {
  onPlaceBet: (amount: number, prediction: DicePrediction, targetValue?: number) => void;
  disabled?: boolean;
}

const BettingPanel: React.FC<BettingPanelProps> = ({ onPlaceBet, disabled }) => {
  const [betAmount, setBetAmount] = useState(0.1);
  const [prediction, setPrediction] = useState<DicePrediction>('over');
  const [targetValue, setTargetValue] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBet(
      betAmount,
      prediction,
      prediction === 'exact' ? targetValue : undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setPrediction('over')}
          className={`flex flex-col items-center p-4 rounded-lg ${
            prediction === 'over'
              ? 'bg-green-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <ArrowUp className="w-6 h-6 mb-2" />
          <span className="font-semibold">Over 3</span>
          <span className="text-sm text-gray-300">2x</span>
        </button>

        <button
          type="button"
          onClick={() => setPrediction('under')}
          className={`flex flex-col items-center p-4 rounded-lg ${
            prediction === 'under'
              ? 'bg-red-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <ArrowDown className="w-6 h-6 mb-2" />
          <span className="font-semibold">Under 4</span>
          <span className="text-sm text-gray-300">2x</span>
        </button>

        <button
          type="button"
          onClick={() => setPrediction('exact')}
          className={`flex flex-col items-center p-4 rounded-lg ${
            prediction === 'exact'
              ? 'bg-indigo-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Target className="w-6 h-6 mb-2" />
          <span className="font-semibold">Exact</span>
          <span className="text-sm text-gray-300">6x</span>
        </button>
      </div>

      {prediction === 'exact' && (
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => setTargetValue(num)}
              className={`aspect-square flex items-center justify-center rounded-lg font-bold ${
                targetValue === num
                  ? 'bg-indigo-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold disabled:opacity-50"
      >
        Roll Dice
      </button>
    </form>
  );
};

export default BettingPanel;