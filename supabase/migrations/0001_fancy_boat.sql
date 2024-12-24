/*
  # Initial Schema Setup for UBI Token System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, linked to auth.users)
      - `subscription_tier` (text)
      - `last_ubi_claim` (timestamp)
      - `created_at` (timestamp)
    - `daily_ubi_pools`
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `total_amount` (numeric)
      - `claimant_count` (integer)
      - `distributed` (boolean)
    - `ubi_claims`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `pool_id` (uuid, references daily_ubi_pools)
      - `amount` (numeric)
      - `created_at` (timestamp)
    - `balances`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `real_balance` (numeric)
      - `play_money_balance` (numeric)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  subscription_tier text DEFAULT 'free',
  last_ubi_claim timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Daily UBI pools
CREATE TABLE daily_ubi_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  claimant_count integer NOT NULL DEFAULT 0,
  distributed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_ubi_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pools"
  ON daily_ubi_pools FOR SELECT
  TO authenticated
  USING (true);

-- UBI claims
CREATE TABLE ubi_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  pool_id uuid REFERENCES daily_ubi_pools(id) NOT NULL,
  amount numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, pool_id)
);

ALTER TABLE ubi_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own claims"
  ON ubi_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims"
  ON ubi_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Balances
CREATE TABLE balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  real_balance numeric NOT NULL DEFAULT 0,
  play_money_balance numeric NOT NULL DEFAULT 1000,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own balance"
  ON balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION claim_daily_ubi()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _last_claim timestamptz;
  _pool_id uuid;
BEGIN
  -- Get authenticated user
  _user_id := auth.uid();
  
  -- Check last claim
  SELECT last_ubi_claim INTO _last_claim
  FROM profiles
  WHERE id = _user_id;
  
  IF _last_claim >= CURRENT_DATE THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Already claimed today'
    );
  END IF;

  -- Get or create today's pool
  INSERT INTO daily_ubi_pools (date)
  VALUES (CURRENT_DATE)
  ON CONFLICT (date) DO UPDATE
  SET claimant_count = daily_ubi_pools.claimant_count + 1
  RETURNING id INTO _pool_id;

  -- Record claim
  INSERT INTO ubi_claims (user_id, pool_id)
  VALUES (_user_id, _pool_id);

  -- Update last claim time
  UPDATE profiles
  SET last_ubi_claim = now()
  WHERE id = _user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Claim recorded'
  );
END;
$$;