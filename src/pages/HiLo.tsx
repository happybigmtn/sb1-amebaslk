import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PlayingCard from '../components/hilo/PlayingCard';
import PlayerList from '../components/hilo/PlayerList';
import GameControls from '../components/hilo/GameControls';
import GameChat from '../components/chat/GameChat';
import { useHiloGame } from '../hooks/useHiloGame';
import TestPanel from '../components/test/TestPanel';

const HiLo = () => {
  const { connected } = useWallet();
  const { 
    currentCard,
    previousCard,
    multiplier,
    betAmount,
    setBetAmount,
    placeBet,
    makeChoice,
    cashOut,
    players,
    activePlayers,
    remainingBlocks,
    isBettingOpen,
    isInGame
  } = useHiloGame();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">HiLo</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">HiLo</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex justify-center space-x-8 mb-8">
              {previousCard && (
                <PlayingCard value={previousCard} revealed />
              )}
              <PlayingCard 
                value={currentCard} 
                revealed={Boolean(currentCard)}
              />
            </div>

            {!isInGame && isBettingOpen ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bet Amount
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                  />
                </div>
                <button
                  onClick={() => placeBet()}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold"
                >
                  Place Bet
                </button>
              </div>
            ) : (
              <GameControls
                onHigher={() => makeChoice('higher')}
                onLower={() => makeChoice('lower')}
                onEqual={() => makeChoice('equal')}
                onCashOut={cashOut}
                multiplier={multiplier}
                disabled={!isInGame || !currentCard}
              />
            )}

            {!isBettingOpen && (
              <div className="mt-4 text-center text-gray-400">
                Next card in {remainingBlocks} blocks
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <PlayerList
            players={players}
            activePlayers={activePlayers}
          />
          
          <GameChat gameRoom="hilo" />

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Payouts</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Higher/Lower</span>
                <span>2x + card difference</span>
              </div>
              <div className="flex justify-between">
                <span>Equal</span>
                <span>14x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TestPanel />
    </div>
  );
};

export default HiLo;