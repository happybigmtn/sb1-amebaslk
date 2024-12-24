import React from 'react';
import { Card } from '../../types/game';
import PlayingCard from '../game/Card';
import { calculateHandValue } from '../../utils/cards';

interface PlayerHandProps {
  cards: Card[];
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards }) => {
  const value = calculateHandValue(cards);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold text-gray-300">
        Your Hand ({value})
      </div>
      <div className="flex space-x-2">
        {cards.map((card, index) => (
          <PlayingCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};