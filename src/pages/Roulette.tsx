import React from 'react';
import RouletteGame from '../components/roulette/RouletteGame';
import GameChat from '../components/chat/GameChat';
import TestPanel from '../components/test/TestPanel';

const Roulette = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Roulette</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <RouletteGame />
          </div>
        </div>
        <div>
          <GameChat gameRoom="roulette" />
        </div>
      </div>
      <TestPanel />
    </div>
  );
};

export default Roulette;