import React from 'react';
import { useAgent } from '../../hooks/useAgent';
import { AgentStatus } from '../../lib/agents/types';
import { Bot, Swords, Clock } from 'lucide-react';

const AgentCard: React.FC = () => {
  const { agent, loading, error, startMission } = useAgent();

  if (loading) return <div>Loading agent...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!agent) return <div>No agent found</div>;

  const getStatusIcon = () => {
    switch (agent.status) {
      case AgentStatus.Training:
        return <Bot className="w-5 h-5 text-blue-500" />;
      case AgentStatus.OnMission:
        return <Swords className="w-5 h-5 text-green-500" />;
      case AgentStatus.Cooldown:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bot className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Your Agent</h3>
        {getStatusIcon()}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Level</span>
          <span>{agent.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Experience</span>
          <span>{agent.experience}</span>
        </div>
      </div>

      {agent.status === AgentStatus.Idle && (
        <button
          onClick={() => startMission(0)}
          className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold"
        >
          Start Mission
        </button>
      )}
    </div>
  );
};