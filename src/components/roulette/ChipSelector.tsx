import React from 'react';
import { Coins } from 'lucide-react';

const CHIP_VALUES = [0.1, 0.5, 1, 5, 10, 50];

interface ChipSelectorProps {
  selectedValue: number;
  onSelect: (value: number) => void;
}

const ChipSelector: React.FC<ChipSelectorProps> = ({ selectedValue, onSelect }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {CHIP_VALUES.map((value) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center 
            ${selectedValue === value 
              ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-800' 
              : ''}`}
          style={{
            background: `linear-gradient(135deg, 
              ${value <= 1 ? '#e11d48' : value <= 5 ? '#4f46e5' : '#16a34a'}, 
              ${value <= 1 ? '#be123c' : value <= 5 ? '#3730a3' : '#15803d'})`
          }}
        >
          <Coins className="w-4 h-4 text-white absolute top-1" />
          <span className="text-white font-bold text-sm">{value}</span>
        </button>
      ))}
    </div>
  );
};