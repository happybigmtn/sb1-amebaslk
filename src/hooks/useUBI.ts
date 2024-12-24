import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useUBI = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimDaily = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('claim_daily_ubi');

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim UBI');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('balances')
      .select('real_balance, play_money_balance')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  };

  return {
    claimDaily,
    getBalance,
    loading,
    error
  };
};