import React from 'react';

interface ControlsProps {
  onHit: () => void;
  onStand: () => void;
  onDeal: () => void;
  canHit: boolean;
  canStand: boolean;
  canDeal: boolean;
  betAmount: number;
  onBetChange: (amount: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onHit,
  onStand,
  onDeal,
  canHit,
  canStand,
  canDeal,
  betAmount,
  onBetChange,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {canDeal && (
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={betAmount}
            onChange={(e) => onBetChange(parseFloat(e.target.value))}
            className="w-24 px-3 py-2 bg-gray-700 rounded-md text-white"
          />
          <button
            onClick={onDeal}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold"
          >
            Deal
          </button>
        </div>
      )}
      
      {!canDeal && (
        <div className="flex space-x-4">
          <button
            onClick={onHit}
            disabled={!canHit}
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              canHit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Hit
          </button>
          <button
            onClick={onStand}
            disabled={!canStand}
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              canStand ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Stand
          </button>
        </div>
      )}
    </div>
  );
};

export default Controls;