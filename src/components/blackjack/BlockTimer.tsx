import React from 'react';
import { Clock } from 'lucide-react';
import { useBlockTimer } from '../../hooks/useBlockTimer';

interface BlockTimerProps {
  endBlock: number;
}

const BlockTimer: React.FC<BlockTimerProps> = ({ endBlock }) => {
  const { remainingBlocks, isExpired } = useBlockTimer(endBlock);

  return (
    <div className="flex items-center space-x-2 text-gray-300">
      <Clock className="w-4 h-4" />
      <span>
        {isExpired ? (
          'Betting closed'
        ) : (
          `${remainingBlocks} blocks remaining`
        )}
      </span>
    </div>
  );
};