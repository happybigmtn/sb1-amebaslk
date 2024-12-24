import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import GameChat from '../chat/GameChat';
import TestPanel from '../test/TestPanel';

interface GameLayoutProps {
  title: string;
  gameRoom: string;
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ title, gameRoom, children }) => {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {children}
        </div>
        <div>
          <GameChat gameRoom={gameRoom} />
        </div>
      </div>
      <TestPanel />
    </div>
  );
};

export default GameLayout;