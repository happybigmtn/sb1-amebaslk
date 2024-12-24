import React from 'react';

interface InsuranceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  betAmount: number;
}

const InsuranceModal: React.FC<InsuranceModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
  betAmount
}) => {
  if (!isOpen) return null;

  const insuranceAmount = betAmount / 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Insurance Offered</h3>
        <p className="text-gray-300 mb-4">
          Dealer is showing an Ace. Would you like to take insurance for {insuranceAmount} SOL?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onAccept}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
          >
            Yes ({insuranceAmount} SOL)
          </button>
          <button
            onClick={onDecline}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
};