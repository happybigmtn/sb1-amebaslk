import React from 'react';
import BlackjackTable from '../components/blackjack/Table';
import GameChat from '../components/chat/GameChat';
import TestPanel from '../components/test/TestPanel';

const Blackjack = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blackjack</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <BlackjackTable />
          </div>
        </div>
        <div>
          <GameChat gameRoom="blackjack" />
        </div>
      </div>
      <TestPanel />
    </div>
  );
};

export default Blackjack;