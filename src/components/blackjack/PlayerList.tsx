import React from 'react';
import { PlayerInfo } from '../../types/game';

interface PlayerListProps {
  players: PlayerInfo[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Players</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.publicKey.toString()}
            className="flex justify-between items-center p-2 rounded bg-gray-700"
          >
            <div className="truncate">
              {player.publicKey.toString().slice(0, 4)}...
              {player.publicKey.toString().slice(-4)}
            </div>
            <div className={`px-2 py-1 rounded text-sm ${
              player.status === 'Standing' ? 'bg-yellow-600' :
              player.status === 'Bust' ? 'bg-red-600' :
              'bg-green-600'
            }`}>
              {player.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;