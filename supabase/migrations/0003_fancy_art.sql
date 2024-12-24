/*
  # Agent Social Features Schema

  1. New Tables
    - `agent_posts`: Stores social media posts made by agents
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `platform` (text, social platform)
      - `content` (text, post content)
      - `timestamp` (timestamptz)
      - `engagement` (jsonb, engagement metrics)

    - `agent_stakes`: Tracks staking information
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `staker` (text, staker's public key)
      - `amount` (numeric, stake amount)
      - `timestamp` (timestamptz)
      - `share` (numeric, profit share percentage)

    - `agent_performance`: Tracks agent performance metrics
      - `agent_id` (uuid, primary key)
      - `total_winnings` (numeric)
      - `total_staked` (numeric)
      - `stakers_count` (integer)
      - `win_rate` (numeric)
      - `last_payout` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for read/write access
*/

-- Agent Posts Table
CREATE TABLE agent_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform IN ('twitter', 'discord')),
  content text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  engagement jsonb NOT NULL DEFAULT '{"likes": 0, "replies": 0, "shares": 0}'::jsonb
);

ALTER TABLE agent_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
  ON agent_posts FOR SELECT
  USING (true);

CREATE POLICY "Agents can create posts"
  ON agent_posts FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Will be restricted by application logic

-- Agent Stakes Table
CREATE TABLE agent_stakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  staker text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  timestamp timestamptz NOT NULL DEFAULT now(),
  share numeric NOT NULL DEFAULT 0,
  UNIQUE(agent_id, staker)
);

ALTER TABLE agent_stakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stakes"
  ON agent_stakes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can stake"
  ON agent_stakes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Agent Performance Table
CREATE TABLE agent_performance (
  agent_id uuid PRIMARY KEY,
  total_winnings numeric NOT NULL DEFAULT 0,
  total_staked numeric NOT NULL DEFAULT 0,
  stakers_count integer NOT NULL DEFAULT 0,
  win_rate numeric NOT NULL DEFAULT 0,
  last_payout timestamptz
);

ALTER TABLE agent_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read performance"
  ON agent_performance FOR SELECT
  USING (true);

-- Function to update agent performance
CREATE OR REPLACE FUNCTION update_agent_performance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update stakers count and total staked
  UPDATE agent_performance
  SET 
    stakers_count = (
      SELECT COUNT(DISTINCT staker)
      FROM agent_stakes
      WHERE agent_id = NEW.agent_id
    ),
    total_staked = (
      SELECT SUM(amount)
      FROM agent_stakes
      WHERE agent_id = NEW.agent_id
    )
  WHERE agent_id = NEW.agent_id;
  
  RETURN NEW;
END;
$$;

-- Trigger for updating performance on stake changes
CREATE TRIGGER update_performance_on_stake
  AFTER INSERT OR UPDATE OR DELETE
  ON agent_stakes
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_performance();

-- Function to distribute winnings
CREATE OR REPLACE FUNCTION distribute_agent_winnings(
  p_agent_id uuid,
  p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update total winnings
  UPDATE agent_performance
  SET 
    total_winnings = total_winnings + p_amount,
    win_rate = CASE 
      WHEN total_winnings = 0 THEN 0
      ELSE (total_winnings + p_amount) / total_staked * 100
    END,
    last_payout = now()
  WHERE agent_id = p_agent_id;

  -- TODO: Implement actual token distribution to stakers
  -- This will be handled by the application logic
END;
$$;