import React from 'react';
import { Bet, PAYOUTS } from '../../lib/games/roulette/types';
import { Trash2 } from 'lucide-react';

interface BetListProps {
  bets: Bet[];
  onRemoveBet: (index: number) => void;
}

const BetList: React.FC<BetListProps> = ({ bets, onRemoveBet }) => {
  const formatBetDescription = (bet: Bet) => {
    switch (bet.type) {
      case 'straight':
        return `Number ${bet.numbers[0]}`;
      case 'red':
        return 'Red';
      case 'black':
        return 'Black';
      case 'even':
        return 'Even';
      case 'odd':
        return 'Odd';
      default:
        return bet.type;
    }
  };

  const calculatePotentialWin = (bet: Bet) => {
    return bet.amount * PAYOUTS[bet.type];
  };

  return (
    <div className="space-y-2">
      {bets.map((bet, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-700 rounded"
        >
          <div>
            <div className="font-medium">{formatBetDescription(bet)}</div>
            <div className="text-sm text-gray-400">
              {bet.amount} SOL → {calculatePotentialWin(bet)} SOL
            </div>
          </div>
          
          <button
            onClick={() => onRemoveBet(index)}
            className="p-1 text-gray-400 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};