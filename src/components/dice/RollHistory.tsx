import React from 'react';
import { DiceRoll } from './DiceRoll';
import { formatDistanceToNow } from 'date-fns';
import { DiceResult } from '../../types/dice';

interface RollHistoryProps {
  history: DiceResult[];
}

const RollHistory: React.FC<RollHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-2">
      {history.map((result, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-3 rounded-lg ${
            result.payout > 0 ? 'bg-green-900/20' : 'bg-gray-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <DiceRoll value={result.roll} size="sm" />
            <div>
              <div className="text-sm text-gray-400">
                {formatDistanceToNow(result.timestamp)} ago
              </div>
              <div className="font-medium">
                {result.prediction === 'exact' 
                  ? `Exact ${result.targetValue}`
                  : result.prediction === 'over'
                    ? 'Over 3'
                    : 'Under 4'
                }
              </div>
            </div>
          </div>
          <div className={result.payout > 0 ? 'text-green-400' : 'text-red-400'}>
            {result.payout > 0 ? '+' : ''}{result.payout} SOL
          </div>
        </div>
      ))}
    </div>
  );
};

export default RollHistory;