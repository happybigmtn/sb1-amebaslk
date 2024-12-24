import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import AgentCard from '../components/agents/AgentCard';
import MissionList from '../components/agents/MissionList';
import { useAgent } from '../hooks/useAgent';

const Agents = () => {
  const { connected } = useWallet();
  const { agent, startMission } = useAgent();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Agents</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to manage your agents</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Agents</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <AgentCard />
        </div>
        
        <div className="md:col-span-2">
          {agent && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Available Missions</h2>
              <MissionList 
                agent={agent} 
                onSelectMission={startMission} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};