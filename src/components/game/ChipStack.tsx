import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';

interface ChipStackProps {
  amount: number;
  position: { x: number; y: number };
  onRemove?: () => void;
}

const ChipStack: React.FC<ChipStackProps> = ({ amount, position, onRemove }) => {
  const chipCount = Math.min(5, Math.ceil(amount / 0.1));
  
  return (
    <AnimatePresence>
      <div
        className="absolute cursor-pointer"
        style={{ left: position.x, top: position.y }}
        onClick={onRemove}
      >
        {Array.from({ length: chipCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: -i * 4, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-600"
          >
            <Coins className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        ))}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bold text-white">
          {amount} SOL
        </div>
      </div>
    </AnimatePresence>
  );
};