import React from 'react';
import { formatMultiplier } from '../../lib/games/crash/utils';

interface Player {
  address: string;
  betAmount: number;
  exitMultiplier: number | null;
  profit?: number;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold mb-4">Players</h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-2 rounded ${
              player.exitMultiplier 
                ? 'bg-green-900/20' 
                : 'bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {player.address.slice(0, 4)}...{player.address.slice(-4)}
              </span>
              <span className="text-sm text-gray-400">
                {player.betAmount} SOL
              </span>
            </div>
            {player.exitMultiplier && (
              <div className="flex items-center gap-2">
                <span className="text-green-400">
                  {formatMultiplier(player.exitMultiplier)}
                </span>
                <span className="text-green-400">
                  +{player.profit?.toFixed(2)} SOL
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;