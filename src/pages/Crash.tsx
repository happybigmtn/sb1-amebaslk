import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CrashGraph from '../components/crash/CrashGraph';
import BettingPanel from '../components/crash/BettingPanel';
import PlayerList from '../components/crash/PlayerList';
import GameChat from '../components/chat/GameChat';
import { useCrashGame } from '../hooks/useCrashGame';
import { formatMultiplier } from '../lib/games/crash/utils';

const Crash = () => {
  const { connected } = useWallet();
  const {
    multiplier,
    crashed,
    roundActive,
    players,
    nextRoundBlock,
    playerState,
    placeBet,
    cashOut
  } = useCrashGame();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Crash</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Crash</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-4xl font-bold">
                {formatMultiplier(multiplier)}
              </div>
              {!roundActive && (
                <div className="text-gray-400">
                  Next round in {nextRoundBlock} blocks
                </div>
              )}
            </div>
            
            <CrashGraph
              multiplier={multiplier}
              crashed={crashed}
            />

            {playerState.betPlaced && !playerState.exited && (
              <button
                onClick={cashOut}
                disabled={crashed}
                className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold disabled:opacity-50"
              >
                Cash Out @ {formatMultiplier(multiplier)}
              </button>
            )}
          </div>

          <BettingPanel
            onPlaceBet={placeBet}
            disabled={roundActive || playerState.betPlaced}
          />
        </div>
        
        <div className="space-y-6">
          <PlayerList players={players} />
          <GameChat gameRoom="crash" />
        </div>
      </div>
    </div>
  );
};

export default Crash;