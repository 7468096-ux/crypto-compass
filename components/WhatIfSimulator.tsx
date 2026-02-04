'use client';

import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, TrendingDown, Calculator, Coins } from 'lucide-react';

interface CryptoOption {
  id: string;
  symbol: string;
  name: string;
  color: string;
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#14F195' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', color: '#F3BA2F' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', color: '#23292F' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', color: '#0033AD' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633' },
];

interface TimeOption {
  label: string;
  days: number;
}

const TIME_OPTIONS: TimeOption[] = [
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: '1 year', days: 365 },
  { label: '2 years', days: 730 },
];

const AMOUNT_PRESETS = [100, 500, 1000, 5000, 10000];

interface SimulationResult {
  initialPrice: number;
  currentPrice: number;
  initialValue: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  coinsOwned: number;
}

export default function WhatIfSimulator() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(CRYPTO_OPTIONS[0]);
  const [selectedTime, setSelectedTime] = useState<TimeOption>(TIME_OPTIONS[2]); // 6 months default
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get historical data
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart?vs_currency=usd&days=${selectedTime.days}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      const prices = data.prices as [number, number][];
      
      if (!prices || prices.length < 2) {
        throw new Error('Insufficient price data');
      }
      
      const initialPrice = prices[0][1];
      const currentPrice = prices[prices.length - 1][1];
      const coinsOwned = amount / initialPrice;
      const currentValue = coinsOwned * currentPrice;
      const profit = currentValue - amount;
      const profitPercent = ((currentValue - amount) / amount) * 100;
      
      setResult({
        initialPrice,
        currentPrice,
        initialValue: amount,
        currentValue,
        profit,
        profitPercent,
        coinsOwned,
      });
    } catch (err) {
      setError('Failed to fetch historical data. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedCrypto, selectedTime, amount]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(6)}`;
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <Clock className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">What If Simulator</h2>
          <p className="text-gray-400 text-sm">See what your investment would be worth today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Crypto Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Cryptocurrency
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {CRYPTO_OPTIONS.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    selectedCrypto.id === crypto.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium text-white">{crypto.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time.days}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedTime.days === time.days
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600 text-gray-300'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Investment Amount (USD)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {AMOUNT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleAmountChange(preset)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    amount === preset && !customAmount
                      ? 'border-green-500 bg-green-500/20 text-green-300'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600 text-gray-300'
                  }`}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Or enter custom amount..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center">
                <Calculator className="w-8 h-8 animate-pulse mx-auto text-purple-500 mb-2" />
                <p className="text-gray-400">Calculating...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-red-400">{error}</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="text-center pb-4 border-b border-gray-700">
                <p className="text-gray-400 text-sm mb-1">
                  If you invested {formatCurrency(amount)} in {selectedCrypto.symbol} {selectedTime.label} ago
                </p>
                <p className="text-3xl font-bold text-white mb-2">
                  {formatCurrency(result.currentValue)}
                </p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  result.profit >= 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {result.profit >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {result.profit >= 0 ? '+' : ''}{formatCurrency(result.profit)} ({result.profitPercent >= 0 ? '+' : ''}{result.profitPercent.toFixed(1)}%)
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Price then</p>
                  <p className="text-white font-medium">{formatPrice(result.initialPrice)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Price now</p>
                  <p className="text-white font-medium">{formatPrice(result.currentPrice)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">You would own</p>
                  <p className="text-white font-medium">
                    {result.coinsOwned < 1 
                      ? result.coinsOwned.toFixed(6) 
                      : result.coinsOwned.toFixed(4)} {selectedCrypto.symbol}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Price change</p>
                  <p className={`font-medium ${
                    result.currentPrice >= result.initialPrice ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.currentPrice >= result.initialPrice ? '+' : ''}
                    {(((result.currentPrice - result.initialPrice) / result.initialPrice) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-gray-500 text-xs text-center pt-2">
                Past performance doesn't guarantee future results. Not financial advice.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
