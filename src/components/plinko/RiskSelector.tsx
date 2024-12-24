import React from 'react';
import { Shield, Target, Flame } from 'lucide-react';

interface RiskSelectorProps {
  selected: 'low' | 'medium' | 'high';
  onSelect: (risk: 'low' | 'medium' | 'high') => void;
}

const RiskSelector: React.FC<RiskSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => onSelect('low')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          selected === 'low' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span>Low Risk</span>
      </button>

      <button
        onClick={() => onSelect('medium')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          selected === 'medium'
            ? 'bg-yellow-600 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        <Target className="w-4 h-4" />
        <span>Medium Risk</span>
      </button>

      <button
        onClick={() => onSelect('high')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          selected === 'high'
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        <Flame className="w-4 h-4" />
        <span>High Risk</span>
      </button>
    </div>
  );
};

export default RiskSelector;