import React from 'react';
import { SpinResult } from '../../lib/games/roulette/types';
import { getHotNumbers, getColdNumbers } from '../../lib/games/roulette/statistics';
import { Flame, Snowflake } from 'lucide-react';

interface StatisticsProps {
  history: SpinResult[];
}

const Statistics: React.FC<StatisticsProps> = ({ history }) => {
  const hotNumbers = getHotNumbers(history);
  const coldNumbers = getColdNumbers(history);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold">Hot Numbers</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {hotNumbers.map(num => (
            <div key={num} className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Snowflake className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Cold Numbers</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {coldNumbers.map(num => (
            <div key={num} className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};