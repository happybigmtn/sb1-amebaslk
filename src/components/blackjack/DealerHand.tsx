import React from 'react';
import { Card } from '../../types/game';
import PlayingCard from '../game/Card';

interface DealerHandProps {
  cards: Card[];
}

const DealerHand: React.FC<DealerHandProps> = ({ cards }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold text-gray-300">Dealer</div>
      <div className="flex space-x-2">
        {cards.map((card, index) => (
          <PlayingCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};