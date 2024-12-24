import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Hand from '../game/Hand';
import Controls from '../game/Controls';
import BlockTimer from './BlockTimer';
import { useBlackjack } from '../../hooks/useBlackjack';

const BlackjackTable: React.FC = () => {
  const { connected } = useWallet();
  const {
    playerHand,
    dealerHand,
    gameState,
    betAmount,
    setBetAmount,
    dealNewHand,
    hit,
    stand,
    getGameResult,
    bettingEndBlock
  } = useBlackjack();

  if (!connected) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {gameState === 'betting' && bettingEndBlock && (
        <BlockTimer endBlock={bettingEndBlock} />
      )}
      
      <div className="flex flex-col items-center space-y-8">
        <Hand hand={dealerHand} label="Dealer" />
        <Hand hand={playerHand} label="Player" />
      </div>

      {gameState === 'gameOver' && (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">{getGameResult()}</p>
          <button
            onClick={dealNewHand}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold"
          >
            New Hand
          </button>
        </div>
      )}

      {gameState !== 'gameOver' && (
        <Controls
          onHit={hit}
          onStand={stand}
          onDeal={dealNewHand}
          canHit={gameState === 'playing'}
          canStand={gameState === 'playing'}
          canDeal={gameState === 'betting'}
          betAmount={betAmount}
          onBetChange={setBetAmount}
        />
      )}
    </div>
  );
};