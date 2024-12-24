import React from 'react';
import { ArrowUp, ArrowDown, Minus, CreditCard } from 'lucide-react';

interface GameControlsProps {
  onHigher: () => void;
  onLower: () => void;
  onEqual: () => void;
  onCashOut: () => void;
  multiplier: number;
  disabled?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onHigher,
  onLower,
  onEqual,
  onCashOut,
  multiplier,
  disabled
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onHigher}
          disabled={disabled}
          className="flex flex-col items-center p-4 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
        >
          <ArrowUp className="w-8 h-8 mb-2" />
          <span className="font-bold">Higher</span>
          <span className="text-sm">2x+</span>
        </button>

        <button
          onClick={onEqual}
          disabled={disabled}
          className="flex flex-col items-center p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg disabled:opacity-50"
        >
          <Minus className="w-8 h-8 mb-2" />
          <span className="font-bold">Equal</span>
          <span className="text-sm">14x</span>
        </button>

        <button
          onClick={onLower}
          disabled={disabled}
          className="flex flex-col items-center p-4 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
        >
          <ArrowDown className="w-8 h-8 mb-2" />
          <span className="font-bold">Lower</span>
          <span className="text-sm">2x+</span>
        </button>
      </div>

      <button
        onClick={onCashOut}
        disabled={disabled}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold disabled:opacity-50"
      >
        <div className="flex items-center justify-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Cash Out ({multiplier}x)</span>
        </div>
      </button>
    </div>
  );
};

export default GameControls;