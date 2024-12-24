import React, { useEffect, useRef, useState } from 'react';
import { SpinResult } from '../../lib/games/roulette/types';
import { RED_NUMBERS } from '../../lib/games/roulette/constants';
import { calculateRotation, getWheelTransform, ANIMATION_DURATION } from '../../lib/games/roulette/animations';
import { playRouletteSound } from '../../lib/games/roulette/sounds';

interface RouletteWheelProps {
  spinning: boolean;
  result?: SpinResult;
  onSpinComplete: () => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  spinning,
  result,
  onSpinComplete
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (spinning && result) {
      const startTime = Date.now();
      playRouletteSound('BALL_SPIN');
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(1, elapsed / ANIMATION_DURATION);
        setProgress(newProgress);
        
        if (newProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          playRouletteSound('BALL_DROP');
          onSpinComplete();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [spinning, result]);

  const rotation = result ? calculateRotation(result) : 0;
  const transform = getWheelTransform(spinning, rotation, progress);

  return (
    <div className="relative w-96 h-96 mx-auto">
      <div
        ref={wheelRef}
        className="absolute inset-0 rounded-full border-4 border-gray-700 bg-gray-800 transition-transform duration-[4000ms] ease-out"
        style={{ transform }}
      >
        {/* Wheel numbers */}
        {Array.from({ length: 37 }).map((_, i) => {
          const color = i === 0 ? 'green' : RED_NUMBERS.includes(i) ? 'red' : 'black';
          const rotation = (i * (360 / 37)) + 'deg';
          
          return (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${rotation})` }}
            >
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-16 
                  ${color === 'red' ? 'bg-red-600' : 
                    color === 'black' ? 'bg-gray-900' : 
                    'bg-green-600'}`}
              >
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold">
                  {i}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Ball indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-white" />
    </div>
  );
};