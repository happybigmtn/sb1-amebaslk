import React, { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useGameTiming } from '../../hooks/useGameTiming';
import { useBalance } from '../../hooks/useBalance';
import GameStateMonitor from './GameStateMonitor';
import TimingMonitor from './TimingMonitor';
import TransactionLog from './TransactionLog';

const TestPanel: React.FC = () => {
  const { connection } = useConnection();
  const { currentSlot, isBettingOpen } = useGameTiming();
  const { ubiBalance, fmBalance } = useBalance();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toISOString()}] ${message}`, ...prev]);
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-gray-800 rounded-lg shadow-lg p-4 space-y-4 max-h-[calc(100vh-2rem)] overflow-auto">
      <h2 className="text-lg font-bold">Test Panel</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Current Slot:</span>
          <span>{currentSlot}</span>
        </div>
        <div className="flex justify-between">
          <span>Betting Window:</span>
          <span className={isBettingOpen ? 'text-green-500' : 'text-red-500'}>
            {isBettingOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>UBI Balance:</span>
          <span>{ubiBalance}</span>
        </div>
        <div className="flex justify-between">
          <span>FM Balance:</span>
          <span>{fmBalance}</span>
        </div>
      </div>

      <GameStateMonitor onLog={addLog} />
      <TimingMonitor onLog={addLog} />
      <TransactionLog logs={logs} />
    </div>
  );
};

export default TestPanel;