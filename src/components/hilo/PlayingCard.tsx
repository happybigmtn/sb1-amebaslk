import React from 'react';
import { motion } from 'framer-motion';

interface PlayingCardProps {
  value?: number;
  revealed?: boolean;
  className?: string;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ value, revealed, className = '' }) => {
  const getSuit = (value: number) => {
    const suits = ['♠️', '♥️', '♣️', '♦️'];
    return suits[Math.floor((value - 1) / 13)];
  };

  const getRank = (value: number) => {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return ranks[(value - 1) % 13];
  };

  const isRed = (value: number) => {
    const suit = Math.floor((value - 1) / 13);
    return suit === 1 || suit === 3;
  };

  return (
    <motion.div
      initial={{ rotateY: 180 }}
      animate={{ rotateY: revealed ? 0 : 180 }}
      transition={{ duration: 0.6 }}
      className={`w-48 h-72 relative preserve-3d ${className}`}
    >
      {/* Front */}
      <div className={`absolute inset-0 backface-hidden bg-white rounded-xl p-4 flex flex-col
        ${isRed(value || 1) ? 'text-red-600' : 'text-gray-900'}`}>
        {value && (
          <>
            <div className="text-2xl font-bold">{getRank(value)}</div>
            <div className="text-4xl flex-grow flex items-center justify-center">
              {getSuit(value)}
            </div>
            <div className="text-2xl font-bold rotate-180">{getRank(value)}</div>
          </>
        )}
      </div>

      {/* Back */}
      <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-xl rotate-y-180">
        <div className="w-full h-full border-4 border-white rounded-lg m-4"></div>
      </div>
    </motion.div>
  );
};

export default PlayingCard;