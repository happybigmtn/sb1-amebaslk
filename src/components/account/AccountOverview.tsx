import React from 'react';
import { Wallet, TrendingUp, History, Award } from 'lucide-react';

interface AccountStats {
  balance: number;
  totalWagered: number;
  totalWon: number;
  winRate: number;
  rank: number;
  level: number;
  xp: number;
}

interface AccountOverviewProps {
  stats: AccountStats;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Balance</h3>
          <Wallet className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="text-3xl font-bold">{stats.balance} SOL</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total Wagered</span>
          </div>
          <div className="text-xl font-bold">{stats.totalWagered} SOL</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-sm">Win Rate</span>
          </div>
          <div className="text-xl font-bold">{stats.winRate}%</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <History className="w-4 h-4" />
            <span className="text-sm">Total Won</span>
          </div>
          <div className="text-xl font-bold text-green-500">
            +{stats.totalWon} SOL
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Level {stats.level}</h3>
            <p className="text-sm text-gray-400">Rank #{stats.rank}</p>
          </div>
          <div className="text-sm text-gray-400">
            {stats.xp} / {(stats.level + 1) * 1000} XP
          </div>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{
              width: `${(stats.xp / ((stats.level + 1) * 1000)) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;