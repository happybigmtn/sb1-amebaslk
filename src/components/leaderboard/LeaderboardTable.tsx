import React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  player: string;
  totalWagered: number;
  totalWon: number;
  winRate: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, timeframe }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="capitalize">{timeframe} Leaderboard</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-right">Wagered</th>
              <th className="px-4 py-2 text-right">Won</th>
              <th className="px-4 py-2 text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.rank} className="border-t border-gray-700">
                <td className="px-4 py-2">
                  {entry.rank <= 3 ? (
                    <Award className={`w-5 h-5 ${
                      entry.rank === 1 ? 'text-yellow-500' :
                      entry.rank === 2 ? 'text-gray-400' :
                      'text-yellow-700'
                    }`} />
                  ) : (
                    entry.rank
                  )}
                </td>
                <td className="px-4 py-2">{entry.player}</td>
                <td className="px-4 py-2 text-right">{entry.totalWagered} SOL</td>
                <td className="px-4 py-2 text-right">
                  <span className={entry.totalWon > 0 ? 'text-green-500' : 'text-red-500'}>
                    {entry.totalWon > 0 ? '+' : ''}{entry.totalWon} SOL
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <TrendingUp className={`w-4 h-4 ${
                      entry.winRate > 50 ? 'text-green-500' : 'text-red-500'
                    }`} />
                    {entry.winRate}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;