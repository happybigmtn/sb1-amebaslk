import React from 'react';
import { useUBI } from '../../hooks/useUBI';
import { Coins } from 'lucide-react';

const UBIButton: React.FC = () => {
  const { claimDaily, loading, error } = useUBI();

  const handleClaim = async () => {
    try {
      await claimDaily();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md font-semibold ${
        loading
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      <Coins className="w-5 h-5" />
      <span>{loading ? 'Claiming...' : 'Claim Daily UBI'}</span>
    </button>
  );
};