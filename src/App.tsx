import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './components/WalletProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blackjack from './pages/Blackjack';
import Roulette from './pages/Roulette';
import Baccarat from './pages/Baccarat';
import Agents from './pages/Agents';

function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blackjack" element={<Blackjack />} />
              <Route path="/roulette" element={<Roulette />} />
              <Route path="/baccarat" element={<Baccarat />} />
              <Route path="/agents" element={<Agents />} />
            </Routes>
          </main>
        </div>
      </WalletProvider>
    </BrowserRouter>
  );
}