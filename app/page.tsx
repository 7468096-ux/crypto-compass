'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CryptoTable from '@/components/CryptoTable';
import PortfolioBuilder from '@/components/PortfolioBuilder';
import WhatIfSimulator from '@/components/WhatIfSimulator';
import { CryptoData } from '@/lib/coingecko';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function Home() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [cryptoCount, setCryptoCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCryptos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${cryptoCount}&page=1&sparkline=true&price_change_percentage=24h,7d`,
        {
          headers: { 'Accept': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCryptos(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    // Refresh every 5 minutes
    const interval = setInterval(fetchCryptos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cryptoCount]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Header 
        isSimpleMode={isSimpleMode}
        onModeToggle={() => setIsSimpleMode(!isSimpleMode)}
        cryptoCount={cryptoCount}
        onCountChange={setCryptoCount}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Top {cryptoCount} Cryptocurrencies
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isSimpleMode 
                ? 'Simplified view for beginners' 
                : 'Advanced metrics for experienced traders'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-gray-500 text-sm">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchCryptos}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && cryptos.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
              <p className="text-gray-400">Loading cryptocurrency data...</p>
            </div>
          </div>
        )}

        {/* Crypto Table */}
        {cryptos.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <CryptoTable cryptos={cryptos} isSimpleMode={isSimpleMode} />
          </div>
        )}

        {/* Portfolio Builder */}
        {cryptos.length > 0 && (
          <div className="mt-8">
            <PortfolioBuilder />
          </div>
        )}

        {/* What If Simulator */}
        {cryptos.length > 0 && (
          <div className="mt-8">
            <WhatIfSimulator />
          </div>
        )}

        {/* Info Cards for Simple Mode */}
        {isSimpleMode && cryptos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <InfoCard 
              title="What is Market Cap?"
              description="Market cap = Price × Total coins. Higher market cap usually means more stable and established."
              emoji="📊"
            />
            <InfoCard 
              title="24h Change"
              description="Shows how much the price changed in the last 24 hours. Green = up, Red = down."
              emoji="📈"
            />
            <InfoCard 
              title="Why Top 10?"
              description="Top cryptocurrencies by market cap are generally considered safer for beginners."
              emoji="🎯"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Data provided by CoinGecko API • Prices update every 5 minutes</p>
          <p className="mt-1">CryptoCompass © 2026 • Not financial advice</p>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({ title, description, emoji }: { title: string, description: string, emoji: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
