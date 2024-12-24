import React from 'react';
import { Users } from 'lucide-react';

interface Player {
  address: string;
  betAmount: number;
  entryMultiplier: number;
}

interface PlayerListProps {
  players: Player[];
  activePlayers: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, activePlayers }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Players</h3>
        <div className="flex items-center text-gray-400">
          <Users className="w-4 h-4 mr-2" />
          {activePlayers} Active
        </div>
      </div>

      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
            <div className="text-sm">
              {player.address.slice(0, 4)}...{player.address.slice(-4)}
            </div>
            <div className="text-sm text-gray-400">
              {player.betAmount} SOL @ {player.entryMultiplier}x
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;