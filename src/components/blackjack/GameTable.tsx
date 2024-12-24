import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import GameControls from './GameControls';
import PlayerList from './PlayerList';
import BlockTimer from './BlockTimer';
import { useBlackjackGame } from '../../hooks/useBlackjackGame';

const GameTable: React.FC = () => {
  const { connected } = useWallet();
  const {
    gameState,
    playerState,
    dealerCards,
    betAmount,
    setBetAmount,
    joinGame,
    hit,
    stand,
    bettingEndBlock,
    activePlayers,
    isPlayerTurn,
  } = useBlackjackGame();

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
      {bettingEndBlock && (
        <div className="flex justify-between items-center">
          <BlockTimer endBlock={bettingEndBlock} />
          <div className="text-gray-400">
            Active Players: {activePlayers.length}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="space-y-8">
            <DealerHand cards={dealerCards} />
            {playerState && <PlayerHand cards={playerState.cards} />}
            
            <GameControls
              gameState={gameState}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              onJoin={joinGame}
              onHit={hit}
              onStand={stand}
              isPlayerTurn={isPlayerTurn}
            />
          </div>
        </div>
        
        <div className="col-span-3">
          <PlayerList players={activePlayers} />
        </div>
      </div>
    </div>
  );
};

export default GameTable;