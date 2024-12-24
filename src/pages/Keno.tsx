import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import KenoBoard from '../components/keno/KenoBoard';
import BettingPanel from '../components/keno/BettingPanel';
import GameHistory from '../components/keno/GameHistory';
import GameChat from '../components/chat/GameChat';
import { useKenoGame } from '../hooks/useKenoGame';
import TestPanel from '../components/test/TestPanel';

const Keno = () => {
  const { connected } = useWallet();
  const {
    selectedNumbers,
    drawnNumbers,
    roundActive,
    nextDrawBlock,
    betAmount,
    setBetAmount,
    onNumberSelect,
    placeBet,
    history
  } = useKenoGame();

  if (!connected) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Keno</h1>
        <p className="text-gray-400 mb-4">Connect your wallet to play</p>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Keno</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <KenoBoard
              selectedNumbers={selectedNumbers}
              drawnNumbers={drawnNumbers}
              onNumberSelect={onNumberSelect}
              disabled={roundActive}
            />
          </div>

          <BettingPanel
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            selectedCount={selectedNumbers.length}
            onPlaceBet={placeBet}
            disabled={roundActive || selectedNumbers.length === 0}
            nextDrawBlock={nextDrawBlock}
          />
        </div>
        
        <div className="space-y-6">
          <GameHistory history={history} />
          <GameChat gameRoom="keno" />
        </div>
      </div>
      
      <TestPanel />
    </div>
  );
};

export default Keno;