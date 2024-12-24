import React from 'react';
import { motion } from 'framer-motion';

interface KenoBoardProps {
  selectedNumbers: number[];
  drawnNumbers: number[];
  onNumberSelect: (number: number) => void;
  disabled?: boolean;
}

const KenoBoard: React.FC<KenoBoardProps> = ({
  selectedNumbers,
  drawnNumbers,
  onNumberSelect,
  disabled
}) => {
  const getNumberStatus = (num: number) => {
    const isSelected = selectedNumbers.includes(num);
    const isDrawn = drawnNumbers.includes(num);
    
    if (isSelected && isDrawn) return 'hit';
    if (isSelected) return 'selected';
    if (isDrawn) return 'drawn';
    return 'default';
  };

  return (
    <div className="grid grid-cols-10 gap-2">
      {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
        const status = getNumberStatus(num);
        
        return (
          <motion.button
            key={num}
            onClick={() => !disabled && onNumberSelect(num)}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square flex items-center justify-center rounded-lg text-lg font-bold
              ${status === 'hit' ? 'bg-green-600 text-white' :
                status === 'selected' ? 'bg-indigo-600 text-white' :
                status === 'drawn' ? 'bg-red-600 text-white' :
                'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {num}
          </motion.button>
        );
      })}
    </div>
  );
};

export default KenoBoard;