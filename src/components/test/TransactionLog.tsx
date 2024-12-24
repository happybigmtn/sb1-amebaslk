import React from 'react';

interface TransactionLogProps {
  logs: string[];
}

const TransactionLog: React.FC<TransactionLogProps> = ({ logs }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Transaction Log</h3>
      
      <div className="bg-gray-700 p-2 rounded h-48 overflow-auto">
        {logs.map((log, index) => (
          <div key={index} className="text-xs font-mono mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};