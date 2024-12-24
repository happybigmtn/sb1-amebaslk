import React from 'react';
import { MISSION_TYPES, MISSION_DETAILS } from '../../lib/agents/constants';
import { formatDuration } from '../../lib/agents/utils/time';
import { AgentState } from '../../lib/agents/types';
import { Clock, Star, Trophy } from 'lucide-react';

interface MissionListProps {
  agent: AgentState;
  onSelectMission: (missionType: number) => void;
}

const MissionList: React.FC<MissionListProps> = ({ agent, onSelectMission }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.values(MISSION_TYPES).map((type) => {
        const mission = MISSION_DETAILS[type];
        const isLocked = agent.level < mission.minLevel;
        
        return (
          <button
            key={type}
            onClick={() => !isLocked && onSelectMission(type)}
            disabled={isLocked}
            className={`p-4 rounded-lg border ${
              isLocked
                ? 'bg-gray-800 border-gray-700 cursor-not-allowed'
                : 'bg-gray-700 border-gray-600 hover:border-indigo-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{mission.name}</h4>
                <p className="text-gray-400 text-sm">{mission.description}</p>
              </div>
              {isLocked && (
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Level {mission.minLevel}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(mission.duration)}
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                {mission.expReward} XP
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};