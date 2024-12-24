import React from 'react';
import { Card as CardType } from '../../types/card';

interface CardProps {
  card: CardType;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, className = '' }) => {
  const getSuitColor = () => {
    return card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-gray-900';
  };

  const getSuitSymbol = () => {
    switch (card.suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };

  if (!card.faceUp) {
    return (
      <div className={`w-24 h-36 bg-indigo-600 rounded-lg shadow-md ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-24 border-4 border-white rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-24 h-36 bg-white rounded-lg shadow-md flex flex-col justify-between p-2 ${className}`}>
      <div className="text-lg font-bold">
        <span className={getSuitColor()}>{card.rank}</span>
      </div>
      <div className={`text-4xl flex justify-center ${getSuitColor()}`}>
        {getSuitSymbol()}
      </div>
      <div className="text-lg font-bold rotate-180">
        <span className={getSuitColor()}>{card.rank}</span>
      </div>
    </div>
  );
};

export default Card;