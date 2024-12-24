import React from 'react';
import { Dice } from 'lucide-react';

interface QuickPickProps {
  onQuickPick: (count: number) => void;
  disabled?: boolean;
}

const QuickPick: React.FC<QuickPickProps> = ({ onQuickPick, disabled }) => {
  const options = [3, 5, 8, 10];

  return (
    <div className="flex gap-2">
      {options.map(count => (
        <button
          key={count}
          onClick={() => onQuickPick(count)}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50"
        >
          <Dice className="w-4 h-4" />
          <span>{count}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickPick;