import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { stripe } from '../lib/stripe';

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSubscriptionStatus = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('stripe_customers')
      .select('subscription_status, current_period_end')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  };

  const createSubscription = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const { data, error } = await supabase
        .functions.invoke('create-checkout-session', {
          body: { user_id: user.id }
        });

      if (error) throw error;

      // Redirect to checkout
      const stripeInstance = await stripe;
      if (!stripeInstance) throw new Error('Stripe not initialized');
      
      const result = await stripeInstance.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (result.error) throw result.error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const manageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .functions.invoke('create-portal-session', {
          body: { user_id: user.id }
        });

      if (error) throw error;
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open customer portal');
      throw err;
    }
  };

  return {
    createSubscription,
    manageSubscription,
    getSubscriptionStatus,
    loading,
    error
  };
};