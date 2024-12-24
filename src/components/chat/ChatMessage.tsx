import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ username, message, timestamp }) => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-indigo-400">{username}</span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>
      <p className="text-gray-300">{message}</p>
    </div>
  );
};

export default ChatMessage;