import React from 'react';
import { SpinResult } from '../../lib/games/roulette/types';
import { RED_NUMBERS } from '../../lib/games/roulette/constants';

interface NumbersHistoryProps {
  history: SpinResult[];
}

const NumbersHistory: React.FC<NumbersHistoryProps> = ({ history }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto py-2">
      {history.slice(-10).reverse().map((result, index) => (
        <div
          key={index}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
            ${result.number === 0 
              ? 'bg-green-600' 
              : RED_NUMBERS.includes(result.number)
                ? 'bg-red-600'
                : 'bg-gray-900'}`}
        >
          {result.number}
        </div>
      ))}
    </div>
  );
};