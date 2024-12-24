import React, { useState } from 'react';
import RouletteWheel from './RouletteWheel';
import BettingBoard from './BettingBoard';
import BetList from './BetList';
import Statistics from './Statistics';
import NumbersHistory from './NumbersHistory';
import { SpinResult, Bet } from '../../lib/games/roulette/types';
import { Currency } from '../game/CurrencySelector';
import TestPanel from '../test/TestPanel';

const RouletteGame: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult>();
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('UBI');

  const handlePlaceBet = (bet: Bet, currency: Currency) => {
    setBets([...bets, bet]);
  };

  const handleSpin = () => {
    setSpinning(true);
    // Simulate spin result
    const number = Math.floor(Math.random() * 37);
    setResult({
      number,
      color: number === 0 ? 'green' : 
        [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number) ? 'red' : 'black'
    });
  };

  const handleSpinComplete = () => {
    setSpinning(false);
    if (result) {
      setHistory([result, ...history]);
    }
    setBets([]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <RouletteWheel
            spinning={spinning}
            result={result}
            onSpinComplete={handleSpinComplete}
          />
          <NumbersHistory history={history} />
          <BettingBoard
            onPlaceBet={handlePlaceBet}
            selectedCurrency={selectedCurrency}
            disabled={spinning}
          />
        </div>
        
        <div className="space-y-4">
          <Statistics history={history} />
          <BetList
            bets={bets}
            onRemoveBet={(index) => setBets(bets.filter((_, i) => i !== index))}
          />
          {bets.length > 0 && (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:opacity-50"
            >
              {spinning ? 'Spinning...' : 'Spin'}
            </button>
          )}
        </div>
      </div>
      <TestPanel />
    </div>
  );
};

export default RouletteGame;