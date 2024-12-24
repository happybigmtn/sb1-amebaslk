import React, { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { MessageSquare } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useGameChat } from '../../hooks/useGameChat';

interface GameChatProps {
  gameRoom: string;
}

const GameChat: React.FC<GameChatProps> = ({ gameRoom }) => {
  const { connected } = useWallet();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, loading } = useGameChat(gameRoom);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold">Game Chat</h3>
      </div>

      <div className="h-[400px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              username={msg.username}
              message={msg.message}
              timestamp={msg.created_at}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
          <ChatInput
            onSendMessage={sendMessage}
            disabled={!connected || loading}
          />
        </div>
      </div>
    </div>
  );
};

export default GameChat;