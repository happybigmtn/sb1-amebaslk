import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import DiceRoll from '../components/dice/DiceRoll';
import BettingPanel from '../components/dice/BettingPanel';
import RollHistory from '../components/dice/RollHistory';
import GameChat from '../components/chat/GameChat';
import { useDiceGame } from '../hooks/useDiceGame';

const Dice = () => {
  const { connected } = useWallet();
  const {
    currentRoll,
    rolling,
    placeBet,
    history
  } = useDiceGame();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Dice</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dice</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center">
            <DiceRoll
              value={currentRoll}
              rolling={rolling}
              size="lg"
            />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <BettingPanel
              onPlaceBet={placeBet}
              disabled={rolling}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Roll History</h3>
            <RollHistory history={history} />
          </div>
          
          <GameChat gameRoom="dice" />
        </div>
      </div>
    </div>
  );
};

export default Dice;