import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getRemainingTime } from '../../lib/agents/utils/time';
import { MISSION_DETAILS } from '../../lib/agents/constants';

interface MissionTimerProps {
  lastAction: number;
  missionType: number;
  onComplete: () => void;
}

const MissionTimer: React.FC<MissionTimerProps> = ({ 
  lastAction, 
  missionType, 
  onComplete 
}) => {
  const [remaining, setRemaining] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = getRemainingTime(
        lastAction,
        MISSION_DETAILS[missionType].duration
      );
      
      setRemaining(timeLeft);
      
      if (timeLeft === 0) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastAction, missionType, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex items-center space-x-2 text-yellow-500">
      <Clock className="w-5 h-5" />
      <span>
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};