import React from 'react';
import { motion } from 'framer-motion';

interface LastDrawnProps {
  numbers: number[];
}

const LastDrawn: React.FC<LastDrawnProps> = ({ numbers }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-400 mb-2">Last Drawn</h4>
      <div className="grid grid-cols-10 gap-1">
        {numbers.map((num, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square flex items-center justify-center bg-red-600 rounded text-sm font-bold"
          >
            {num}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LastDrawn;