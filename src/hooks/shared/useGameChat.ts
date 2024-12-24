import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

export const useGameChat = (gameRoom: string) => {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`game_chat_${gameRoom}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_chat_messages',
          filter: `game_room=eq.${gameRoom}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameRoom]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('game_chat_messages')
      .select('*')
      .eq('game_room', gameRoom)
      .order('created_at', { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages(data);
    }
  };

  const sendMessage = async (message: string) => {
    if (!publicKey) return;

    setLoading(true);
    try {
      await supabase.from('game_chat_messages').insert({
        game_room: gameRoom,
        username: publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4),
        message
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading
  };
};