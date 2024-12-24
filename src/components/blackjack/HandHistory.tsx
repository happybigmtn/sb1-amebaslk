import React from 'react';
import { HandResult } from '../../lib/games/blackjack/history';
import { formatDistanceToNow } from 'date-fns';

interface HandHistoryProps {
  history: HandResult[];
}

const HandHistory: React.FC<HandHistoryProps> = ({ history }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Hand History</h3>
      <div className="space-y-2">
        {history.map((hand, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg ${
              hand.result === 'win' ? 'bg-green-900/50' :
              hand.result === 'lose' ? 'bg-red-900/50' :
              hand.result === 'blackjack' ? 'bg-purple-900/50' :
              'bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold capitalize">{hand.result}</span>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(hand.timestamp)} ago
              </span>
            </div>
            <div className="text-sm text-gray-300">
              Bet: {hand.betAmount} SOL • Payout: {hand.payout} SOL
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};