import React from 'react';
import { Bet } from '../../lib/games/roulette/types';

interface RaceTrackProps {
  onPlaceBet: (bet: Bet) => void;
  disabled: boolean;
}

const VOISINS = [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25];
const TIERS = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];
const ORPHELINS = [1, 20, 14, 31, 9, 17, 34, 6];

const RaceTrack: React.FC<RaceTrackProps> = ({ onPlaceBet, disabled }) => {
  const handleVoisins = () => {
    onPlaceBet({
      type: 'straight',
      numbers: VOISINS,
      amount: 0.1
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex space-x-4">
        <button
          onClick={handleVoisins}
          disabled={disabled}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-semibold disabled:opacity-50"
        >
          Voisins
        </button>
        <button
          onClick={() => onPlaceBet({ type: 'straight', numbers: TIERS, amount: 0.1 })}
          disabled={disabled}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-semibold disabled:opacity-50"
        >
          Tiers
        </button>
        <button
          onClick={() => onPlaceBet({ type: 'straight', numbers: ORPHELINS, amount: 0.1 })}
          disabled={disabled}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-semibold disabled:opacity-50"
        >
          Orphelins
        </button>
      </div>
    </div>
  );
};