import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Cards, CircleDot, Dice, Bot } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              Solana Casino
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/blackjack" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md">
                <Cards className="w-5 h-5" />
                <span>Blackjack</span>
              </Link>
              <Link to="/roulette" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md">
                <CircleDot className="w-5 h-5" />
                <span>Roulette</span>
              </Link>
              <Link to="/baccarat" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md">
                <Dice className="w-5 h-5" />
                <span>Baccarat</span>
              </Link>
              <Link to="/agents" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md">
                <Bot className="w-5 h-5" />
                <span>Agents</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UBIButton />
            <SubscribeButton />
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
          </div>
        </div>
      </div>
    </nav>
  );
};