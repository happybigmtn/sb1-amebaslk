import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { BETTING_WINDOW, ACTION_WINDOW } from '../../hooks/useGameTiming';

interface TimingMonitorProps {
  onLog: (message: string) => void;
}

const TimingMonitor: React.FC<TimingMonitorProps> = ({ onLog }) => {
  const { connection } = useConnection();
  const [startSlot, setStartSlot] = useState<number>();
  const [currentSlot, setCurrentSlot] = useState<number>();

  useEffect(() => {
    const interval = setInterval(async () => {
      const slot = await connection.getSlot();
      setCurrentSlot(slot);
      
      if (!startSlot) {
        setStartSlot(slot);
        onLog(`New game round starting at slot ${slot}`);
      } else if (slot >= startSlot + BETTING_WINDOW) {
        onLog(`Betting window closed at slot ${slot}`);
        if (slot >= startSlot + BETTING_WINDOW + ACTION_WINDOW) {
          setStartSlot(undefined);
          onLog(`Action window closed at slot ${slot}`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [connection, startSlot]);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Timing Monitor</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-sm">Start Slot</div>
          <div className="text-lg font-bold">{startSlot || '-'}</div>
        </div>
        
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-sm">Current Slot</div>
          <div className="text-lg font-bold">{currentSlot || '-'}</div>
        </div>
      </div>

      {startSlot && currentSlot && (
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-sm">Progress</div>
          <div className="h-2 bg-gray-600 rounded overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all"
              style={{ 
                width: `${Math.min(100, ((currentSlot - startSlot) / (BETTING_WINDOW + ACTION_WINDOW)) * 100)}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};