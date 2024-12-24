import React from 'react';
import { Hand } from '../../types/card';
import { getBasicStrategy } from '../../lib/games/blackjack/strategy';

interface ActionButtonsProps {
  playerHand: Hand;
  dealerUpCard?: number;
  onHit: () => void;
  onStand: () => void;
  onDouble?: () => void;
  onSplit?: () => void;
  showHints?: boolean;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  playerHand,
  dealerUpCard,
  onHit,
  onStand,
  onDouble,
  onSplit,
  showHints = false,
  disabled = false
}) => {
  const suggestedAction = dealerUpCard && showHints 
    ? getBasicStrategy(playerHand, dealerUpCard)
    : null;

  const canDouble = playerHand.cards.length === 2;
  const canSplit = playerHand.cards.length === 2 && 
    playerHand.cards[0].rank === playerHand.cards[1].rank;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={onHit}
          disabled={disabled}
          className={`px-6 py-2 rounded-md font-semibold
            ${disabled ? 'bg-gray-600 cursor-not-allowed' :
              suggestedAction === 'hit' 
                ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-400'
                : 'bg-green-600 hover:bg-green-700'}`}
        >
          Hit
        </button>
        
        <button
          onClick={onStand}
          disabled={disabled}
          className={`px-6 py-2 rounded-md font-semibold
            ${disabled ? 'bg-gray-600 cursor-not-allowed' :
              suggestedAction === 'stand'
                ? 'bg-red-600 hover:bg-red-700 ring-2 ring-red-400'
                : 'bg-red-600 hover:bg-red-700'}`}
        >
          Stand
        </button>
      </div>

      {(canDouble || canSplit) && (
        <div className="flex space-x-4">
          {canDouble && onDouble && (
            <button
              onClick={onDouble}
              disabled={disabled}
              className={`px-6 py-2 rounded-md font-semibold
                ${disabled ? 'bg-gray-600 cursor-not-allowed' :
                  suggestedAction === 'double'
                    ? 'bg-yellow-600 hover:bg-yellow-700 ring-2 ring-yellow-400'
                    : 'bg-yellow-600 hover:bg-yellow-700'}`}
            >
              Double
            </button>
          )}
          
          {canSplit && onSplit && (
            <button
              onClick={onSplit}
              disabled={disabled}
              className={`px-6 py-2 rounded-md font-semibold
                ${disabled ? 'bg-gray-600 cursor-not-allowed' :
                  suggestedAction === 'split'
                    ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-400'
                    : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              Split
            </button>
          )}
        </div>
      )}
    </div>
  );
};