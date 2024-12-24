import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PlinkoBoardProps {
  path?: boolean[];
  onComplete?: () => void;
}

const ROWS = 16;
const COLS = 17;
const PIN_SIZE = 8;
const BALL_SIZE = 12;

const PlinkoBoard: React.FC<PlinkoBoardProps> = ({ path, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw pins
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4f46e5';

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= row; col++) {
        const x = canvas.width / 2 + (col - row / 2) * 40;
        const y = 60 + row * 40;
        
        ctx.beginPath();
        ctx.arc(x, y, PIN_SIZE, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={700}
        className="bg-gray-900 rounded-lg"
      />
      
      {path && (
        <motion.div
          className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{
            x: path.map((right) => right ? 20 : -20),
            y: path.map((_, i) => 40 + i * 40)
          }}
          transition={{
            duration: 3,
            ease: "linear"
          }}
          onAnimationComplete={onComplete}
        />
      )}
      
      {/* Multiplier slots at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
        {[88, 44, 22, 11, 5, 3, 2, 1, 2, 3, 5, 11, 22, 44, 88].map((multiplier, i) => (
          <div
            key={i}
            className="w-12 h-16 flex items-center justify-center bg-gray-800 rounded-t-lg text-sm font-bold"
          >
            {multiplier}x
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlinkoBoard;