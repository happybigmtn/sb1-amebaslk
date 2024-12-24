import React from 'react';
import Card from './Card';
import { Hand as HandType } from '../../types/card';

interface HandProps {
  hand: HandType;
  label: string;
}

const Hand: React.FC<HandProps> = ({ hand, label }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold text-gray-300">{label} ({hand.value})</div>
      <div className="flex space-x-2">
        {hand.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default Hand;