import React from 'react';
import { motion } from 'framer-motion';
import { Bomb, Diamond } from 'lucide-react';

interface MinesGridProps {
  gridSize: number;
  revealedCells: boolean[];
  mineLocations?: number[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

const MinesGrid: React.FC<MinesGridProps> = ({
  gridSize,
  revealedCells,
  mineLocations,
  onCellClick,
  disabled
}) => {
  const renderCell = (index: number) => {
    const isRevealed = revealedCells[index];
    const isMine = mineLocations?.includes(index);

    return (
      <motion.button
        key={index}
        onClick={() => !disabled && !isRevealed && onCellClick(index)}
        whileHover={{ scale: !disabled && !isRevealed ? 1.05 : 1 }}
        whileTap={{ scale: !disabled && !isRevealed ? 0.95 : 1 }}
        className={`aspect-square rounded-lg flex items-center justify-center
          ${isRevealed
            ? isMine
              ? 'bg-red-600'
              : 'bg-green-600'
            : 'bg-gray-700 hover:bg-gray-600'
          } ${disabled || isRevealed ? 'cursor-not-allowed' : 'cursor-pointer'}`
        }
      >
        {isRevealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white"
          >
            {isMine ? (
              <Bomb className="w-6 h-6" />
            ) : (
              <Diamond className="w-6 h-6" />
            )}
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <div 
      className="grid gap-2" 
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
      }}
    >
      {Array.from({ length: gridSize * gridSize }, (_, i) => renderCell(i))}
    </div>
  );
};

export default MinesGrid;