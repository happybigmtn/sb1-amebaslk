import React from 'react';
import { Hand } from '../../types/card';

interface HandTotalProps {
  hand: Hand;
  className?: string;
}

const HandTotal: React.FC<HandTotalProps> = ({ hand, className = '' }) => {
  const isSoft = hand.cards.some(card => card.rank === 'A' && card.faceUp);
  const total = hand.value;

  return (
    <div className={`inline-flex items-center justify-center px-3 py-1 
      rounded-full text-sm font-semibold ${className}
      ${total > 21 ? 'bg-red-600' : 
        total === 21 ? 'bg-green-600' : 
        'bg-gray-700'}`}
    >
      {isSoft && total <= 21 && 'Soft '}
      {total}
    </div>
  );
};