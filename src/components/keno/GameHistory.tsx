import React from 'react';
import { KenoResult } from '../../types/keno';
import { formatDistanceToNow } from 'date-fns';

interface GameHistoryProps {
  history: KenoResult[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold mb-4">Game History</h3>
      <div className="space-y-2">
        {history.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              result.payout > 0 ? 'bg-green-900/20' : 'bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">
                {result.hits} / {result.selectedNumbers.length} hits
              </span>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(result.timestamp)} ago
              </span>
            </div>
            <div className="text-sm">
              Bet: {result.betAmount} SOL • 
              Payout: {result.payout > 0 ? '+' : ''}{result.payout} SOL
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;