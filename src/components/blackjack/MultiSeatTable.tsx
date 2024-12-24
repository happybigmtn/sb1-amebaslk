import React from 'react';
import { Hand } from '../../types/card';

interface Seat {
  position: number;
  occupied: boolean;
  playerHand?: Hand;
  betAmount?: number;
}

interface MultiSeatTableProps {
  seats: Seat[];
  dealerHand: Hand;
  activeSeat: number;
  onSeatSelect: (position: number) => void;
}

const MultiSeatTable: React.FC<MultiSeatTableProps> = ({
  seats,
  dealerHand,
  activeSeat,
  onSeatSelect
}) => {
  return (
    <div className="relative w-full h-[600px] bg-green-900 rounded-[200px] p-8">
      {/* Dealer's position */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        {/* Dealer hand component */}
      </div>

      {/* Player seats in a semi-circle */}
      <div className="absolute bottom-0 w-full flex justify-around items-end pb-8">
        {seats.map((seat) => (
          <div
            key={seat.position}
            onClick={() => !seat.occupied && onSeatSelect(seat.position)}
            className={`w-32 h-48 rounded-lg ${
              seat.occupied 
                ? 'bg-gray-800' 
                : 'bg-gray-700 cursor-pointer hover:bg-gray-600'
            } ${activeSeat === seat.position ? 'ring-2 ring-yellow-400' : ''}`}
          >
            {seat.occupied && seat.playerHand && (
              <>
                {/* Player hand component */}
                <div className="text-center mt-2">
                  <div className="text-sm text-gray-300">Bet: {seat.betAmount} SOL</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};