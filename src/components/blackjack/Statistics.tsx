import React from 'react';
import { TrendingUp, Coins, Award } from 'lucide-react';

interface Statistics {
  handsPlayed: number;
  winRate: number;
  totalWinnings: number;
  blackjacks: number;
}

interface StatisticsProps {
  stats: Statistics;
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="text-gray-400 text-sm mb-1">Hands Played</div>
        <div className="text-2xl font-bold">{stats.handsPlayed}</div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <TrendingUp className="w-4 h-4 mr-1" />
          Win Rate
        </div>
        <div className="text-2xl font-bold">{stats.winRate}%</div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <Coins className="w-4 h-4 mr-1" />
          Winnings
        </div>
        <div className="text-2xl font-bold">{stats.totalWinnings} SOL</div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <Award className="w-4 h-4 mr-1" />
          Blackjacks
        </div>
        <div className="text-2xl font-bold">{stats.blackjacks}</div>
      </div>
    </div>
  );
};