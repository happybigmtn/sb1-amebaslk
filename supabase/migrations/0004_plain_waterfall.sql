/*
  # Game Chat System

  1. New Tables
    - `game_chat_messages`
      - `id` (uuid, primary key)
      - `game_room` (text) - Game identifier (e.g., 'hilo', 'blackjack')
      - `username` (text) - Truncated wallet address
      - `message` (text) - Chat message content
      - `created_at` (timestamptz) - Message timestamp
    
  2. Security
    - Enable RLS on chat messages table
    - Add policies for authenticated users to read and create messages
*/

-- Chat Messages Table
CREATE TABLE game_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_room text NOT NULL,
  username text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read chat messages"
  ON game_chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON game_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index for faster queries
CREATE INDEX game_chat_messages_game_room_idx ON game_chat_messages(game_room);
CREATE INDEX game_chat_messages_created_at_idx ON game_chat_messages(created_at DESC);