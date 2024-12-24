import React from 'react';
import { Link } from 'react-router-dom';
import { Cards, CircleDot, Dice } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Welcome to Solana Casino
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Experience the future of decentralized gambling with transparent odds,
          instant payouts, and a chance to earn from the house edge.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Link to="/blackjack" className="group">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all">
            <Cards className="w-12 h-12 mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Blackjack</h3>
            <p className="text-gray-400">Test your skills against the house in this classic card game.</p>
          </div>
        </Link>

        <Link to="/roulette" className="group">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all">
            <CircleDot className="w-12 h-12 mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Roulette</h3>
            <p className="text-gray-400">Place your bets and watch the wheel spin in this game of chance.</p>
          </div>
        </Link>

        <Link to="/baccarat" className="group">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all">
            <Dice className="w-12 h-12 mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Baccarat</h3>
            <p className="text-gray-400">Experience the elegance of this high-stakes card game.</p>
          </div>
        </Link>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Universal Betting Income</h2>
        <p className="text-gray-400 mb-4">
          Every bet you place earns you points that will be converted into our governance token.
          Stake your tokens to earn a share of the casino's revenue and participate in governance decisions.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-indigo-500 mb-2">100%</div>
            <div className="text-gray-400">Transparent Odds</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-indigo-500 mb-2">Instant</div>
            <div className="text-gray-400">Payouts</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-indigo-500 mb-2">Community</div>
            <div className="text-gray-400">Governed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;