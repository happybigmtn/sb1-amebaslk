import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? 'Connect wallet to chat' : 'Type a message...'}
        className="flex-1 bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default ChatInput;