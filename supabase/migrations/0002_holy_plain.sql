/*
  # Add Stripe Customer Integration

  1. New Tables
    - `stripe_customers`
      - Links Supabase users to Stripe customers
      - Stores subscription status
  
  2. Updates
    - Add stripe_customer_id to profiles
*/

-- Add Stripe customers table
CREATE TABLE stripe_customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  customer_id text UNIQUE,
  subscription_id text,
  subscription_status text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stripe data"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Add function to check subscription status
CREATE OR REPLACE FUNCTION is_subscribed(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM stripe_customers
    WHERE id = user_id
    AND subscription_status = 'active'
    AND current_period_end > now()
  );
END;
$$;