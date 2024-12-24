import React from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { CreditCard } from 'lucide-react';

const SubscribeButton: React.FC = () => {
  const { createSubscription, loading } = useSubscription();

  return (
    <button
      onClick={() => createSubscription()}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md font-semibold ${
        loading
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-purple-600 hover:bg-purple-700'
      }`}
    >
      <CreditCard className="w-5 h-5" />
      <span>{loading ? 'Processing...' : 'Subscribe - $10/month'}</span>
    </button>
  );
};