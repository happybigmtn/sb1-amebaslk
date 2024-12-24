import React from 'react';
import { Coins, Gift } from 'lucide-react';

export type Currency = 'UBI' | 'FM';

interface CurrencySelectorProps {
  selected: Currency;
  onChange: (currency: Currency) => void;
  ubiBalance: number;
  fmBalance: number;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selected,
  onChange,
  ubiBalance,
  fmBalance
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onChange('UBI')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          selected === 'UBI' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        <Coins className="w-4 h-4" />
        <span>UBI ({ubiBalance})</span>
      </button>

      <button
        onClick={() => onChange('FM')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          selected === 'FM' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        <Gift className="w-4 h-4" />
        <span>FM ({fmBalance})</span>
      </button>
    </div>
  );
};