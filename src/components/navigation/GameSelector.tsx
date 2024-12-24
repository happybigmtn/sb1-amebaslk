import React from 'react';
import { Cards, CircleDot, Bomb, TrendingUp, Dice, Grid } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const GAMES: Game[] = [
  {
    id: 'blackjack',
    title: 'Blackjack',
    icon: <Cards className="w-6 h-6" />,
    description: 'Classic card game against the dealer'
  },
  {
    id: 'roulette',
    title: 'Roulette',
    icon: <CircleDot className="w-6 h-6" />,
    description: 'European roulette with multiple bet types'
  },
  {
    id: 'crash',
    title: 'Crash',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Cash out before the multiplier crashes'
  },
  {
    id: 'mines',
    title: 'Mines',
    icon: <Bomb className="w-6 h-6" />,
    description: 'Avoid the mines and collect gems'
  },
  {
    id: 'dice',
    title: 'Dice',
    icon: <Dice className="w-6 h-6" />,
    description: 'Predict dice rolls with multiple bet types'
  },
  {
    id: 'keno',
    title: 'Keno',
    icon: <Grid className="w-6 h-6" />,
    description: 'Pick your lucky numbers and win big'
  }
];

interface GameSelectorProps {
  onSelect: (game: Game) => void;
  disabled?: boolean;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {GAMES.map(game => (
        <button
          key={game.id}
          onClick={() => !disabled && onSelect(game)}
          className={`p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <div className="flex items-center space-x-3 mb-2">
            {game.icon}
            <span className="font-semibold">{game.title}</span>
          </div>
          <p className="text-sm text-gray-400">{game.description}</p>
        </button>
      ))}
    </div>
  );
};

export default GameSelector;