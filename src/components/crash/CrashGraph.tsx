import React, { useEffect, useRef } from 'react';

interface CrashGraphProps {
  multiplier: number;
  crashed: boolean;
  width?: number;
  height?: number;
}

const CrashGraph: React.FC<CrashGraphProps> = ({
  multiplier,
  crashed,
  width = 800,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw graph
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    for (let x = 0; x < width; x++) {
      const progress = x / width;
      const y = height - (Math.pow(Math.E, 0.06 * progress * multiplier) * height / 4);
      ctx.lineTo(x, y);
    }

    // Style
    ctx.strokeStyle = crashed ? '#ef4444' : '#22c55e';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [multiplier, crashed, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="bg-gray-900 rounded-lg"
    />
  );
};

export default CrashGraph;