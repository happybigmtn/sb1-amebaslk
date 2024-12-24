import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';

interface StatisticsProps {
  totalPlayed: number;
  winRate: number;
  biggestWin: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  totalPlayed,
  winRate,
  biggestWin
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="font-semibold mb-4">Statistics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-sm">Games</span>
          </div>
          <div className="text-xl font-bold">{totalPlayed}</div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Win Rate</span>
          </div>
          <div className="text-xl font-bold">{winRate}%</div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-sm">Best Win</span>
          </div>
          <div className="text-xl font-bold">{biggestWin} SOL</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;