import React from 'react';
import { calculateProgress, getExperienceForNextLevel } from '../../lib/agents/utils/experience';

interface AgentProgressProps {
  level: number;
  experience: number;
}

const AgentProgress: React.FC<AgentProgressProps> = ({ level, experience }) => {
  const progress = calculateProgress(experience, level);
  const nextLevelExp = getExperienceForNextLevel(level);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Level {level}</span>
        <span>{experience} / {nextLevelExp} XP</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};