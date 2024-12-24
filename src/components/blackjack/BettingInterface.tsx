import React from 'react';
import { Coins } from 'lucide-react';
import { Currency } from '../game/CurrencySelector';

interface BettingInterfaceProps {
  selectedValue: number;
  selectedCurrency: Currency;
  onSelect: (value: number) => void;
  onSelectCurrency: (currency: Currency) => void;
  onBet: (amount: number, currency: Currency) => void;
  maxBet: number;
  ubiBalance: number;
  fmBalance: number;
  disabled?: boolean;
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  selectedValue,
  selectedCurrency,
  onSelect,
  onSelectCurrency,
  onBet,
  maxBet,
  ubiBalance,
  fmBalance,
  disabled
}) => {
  const balance = selectedCurrency === 'UBI' ? ubiBalance : fmBalance;

  return (
    <div className="space-y-4">
      <CurrencySelector
        selected={selectedCurrency}
        onChange={onSelectCurrency}
        ubiBalance={ubiBalance}
        fmBalance={fmBalance}
      />

      {/* Rest of the betting interface */}
    </div>
  );
};