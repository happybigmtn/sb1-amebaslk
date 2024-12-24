import React from 'react';
import { MultiGameLayout } from '../components/layout/MultiGameLayout';
import GameSelector from '../components/navigation/GameSelector';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Dashboard = () => {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Solana Casino</h1>
        <p className="text-gray-400 mb-8">Connect your wallet to start playing</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <MultiGameLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Games</h2>
          <GameSelector onSelect={game => {
            // Handle game selection
          }} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          {/* Add recent activity component */}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          {/* Add leaderboard component */}
        </div>
      </div>
    </MultiGameLayout>
  );
};

export default Dashboard;