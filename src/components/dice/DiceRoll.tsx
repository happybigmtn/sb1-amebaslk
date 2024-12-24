import React from 'react';
import { motion } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceRollProps {
  value?: number;
  rolling?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DiceRoll: React.FC<DiceRollProps> = ({ 
  value, 
  rolling = false,
  size = 'md'
}) => {
  const getDiceIcon = () => {
    switch (value) {
      case 1: return <Dice1 />;
      case 2: return <Dice2 />;
      case 3: return <Dice3 />;
      case 4: return <Dice4 />;
      case 5: return <Dice5 />;
      case 6: return <Dice6 />;
      default: return <Dice1 />;
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <motion.div
      animate={rolling ? {
        rotate: [0, 360, 720, 1080],
        scale: [1, 0.8, 1.2, 1]
      } : {}}
      transition={{ duration: 2, ease: "easeOut" }}
      className={`${sizeClasses[size]} bg-white text-gray-900 rounded-xl p-2 shadow-lg`}
    >
      {getDiceIcon()}
    </motion.div>
  );
};

export default DiceRoll;