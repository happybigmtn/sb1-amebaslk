import React, { useEffect, useState } from 'react';
import { Card } from '../../types/card';
import { CardPosition, calculateCardPosition, getCardTransform } from '../../lib/games/blackjack/animations';
import { playSound } from '../../lib/audio/sounds';

interface AnimatedCardProps {
  card: Card;
  index: number;
  total: number;
  isDealer: boolean;
  onAnimationComplete?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  index,
  total,
  isDealer,
  onAnimationComplete
}) => {
  const [position, setPosition] = useState<CardPosition>({ x: -100, y: -100, rotation: 0, scale: 0.5 });
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    // Initial deal animation
    playSound('CARD_DEAL');
    const finalPosition = calculateCardPosition(index, total, isDealer);
    
    setTimeout(() => {
      setPosition(finalPosition);
      onAnimationComplete?.();
    }, 50);
  }, []);

  useEffect(() => {
    // Flip animation
    if (card.faceUp && isFlipping) {
      playSound('CARD_FLIP');
      setIsFlipping(false);
    }
  }, [card.faceUp]);

  return (
    <div
      className={`absolute w-24 h-36 transition-transform duration-300 ease-out
        ${isFlipping ? 'animate-flip' : ''}`}
      style={{ transform: getCardTransform(position) }}
    >
      {/* Card content */}
      <div className={`w-full h-full rounded-lg shadow-lg
        ${card.faceUp ? 'bg-white' : 'bg-indigo-600'}`}>
        {card.faceUp && (
          <div className="p-2">
            {/* Card rank and suit */}
          </div>
        )}
      </div>
    </div>
  );
};