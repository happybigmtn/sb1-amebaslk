import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { getBlackjackProgram, getRouletteProgram } from '../../lib/programs';

interface GameStateMonitorProps {
  onLog: (message: string) => void;
}

const GameStateMonitor: React.FC<GameStateMonitorProps> = ({ onLog }) => {
  const { connection } = useConnection();
  const [blackjackState, setBlackjackState] = useState<any>(null);
  const [rouletteState, setRouletteState] = useState<any>(null);

  useEffect(() => {
    const blackjackProgram = getBlackjackProgram(connection);
    const rouletteProgram = getRouletteProgram(connection);

    const blackjackSub = blackjackProgram.addEventListener('GameState', (state) => {
      setBlackjackState(state);
      onLog(`Blackjack state update: ${JSON.stringify(state)}`);
    });

    const rouletteSub = rouletteProgram.addEventListener('GameState', (state) => {
      setRouletteState(state);
      onLog(`Roulette state update: ${JSON.stringify(state)}`);
    });

    return () => {
      blackjackProgram.removeEventListener(blackjackSub);
      rouletteProgram.removeEventListener(rouletteSub);
    };
  }, [connection]);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Game States</h3>
      
      <div className="bg-gray-700 p-2 rounded">
        <div className="text-sm font-medium mb-1">Blackjack</div>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(blackjackState, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-700 p-2 rounded">
        <div className="text-sm font-medium mb-1">Roulette</div>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(rouletteState, null, 2)}
        </pre>
      </div>
    </div>
  );
};