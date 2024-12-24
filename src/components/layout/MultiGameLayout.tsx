import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Maximize2, Minimize2, X } from 'lucide-react';
import GameChat from '../chat/GameChat';

interface GameWindow {
  id: string;
  title: string;
  component: React.ReactNode;
  minimized: boolean;
}

export const MultiGameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected } = useWallet();
  const [gameWindows, setGameWindows] = useState<GameWindow[]>([]);

  const addGameWindow = (id: string, title: string, component: React.ReactNode) => {
    if (gameWindows.length >= 4) return;
    if (gameWindows.find(w => w.id === id)) return;
    
    setGameWindows(prev => [...prev, { id, title, component, minimized: false }]);
  };

  const removeGameWindow = (id: string) => {
    setGameWindows(prev => prev.filter(w => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setGameWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: !w.minimized } : w
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Solana Casino</h1>
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Game Windows */}
          <div className="col-span-3">
            <div className="grid grid-cols-2 gap-4">
              {gameWindows.map(window => (
                <div 
                  key={window.id}
                  className={`bg-gray-800 rounded-lg overflow-hidden ${
                    window.minimized ? 'h-12' : ''
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-700">
                    <h3 className="font-semibold">{window.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleMinimize(window.id)}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        {window.minimized ? (
                          <Maximize2 className="w-4 h-4" />
                        ) : (
                          <Minimize2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => removeGameWindow(window.id)}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {!window.minimized && (
                    <div className="p-4">
                      {window.component}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="col-span-1">
            <GameChat gameRoom="global" />
          </div>
        </div>
      </div>
    </div>
  );
};