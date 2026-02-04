'use client';

import { useState, useEffect } from 'react';
import { CryptoData } from '@/lib/coingecko';
import { PieChart, DollarSign, TrendingUp, Shield, Target, Zap } from 'lucide-react';

type PortfolioType = 'conservative' | 'balanced' | 'aggressive';

interface PortfolioAllocation {
  symbol: string;
  name: string;
  percentage: number;
  color: string;
}

interface CalculatedAllocation extends PortfolioAllocation {
  amount: number;
  quantity: number;
  currentPrice: number;
}

const PORTFOLIO_TEMPLATES: Record<PortfolioType, {
  name: string;
  description: string;
  icon: React.ReactNode;
  allocations: PortfolioAllocation[];
  risk: string;
}> = {
  conservative: {
    name: 'Conservative',
    description: 'Low risk, stable assets focus',
    icon: <Shield className="w-5 h-5" />,
    risk: 'Low Risk',
    allocations: [
      { symbol: 'BTC', name: 'Bitcoin', percentage: 60, color: '#F7931A' },
      { symbol: 'ETH', name: 'Ethereum', percentage: 30, color: '#627EEA' },
      { symbol: 'USDT', name: 'Stablecoins', percentage: 10, color: '#26A17B' },
    ],
  },
  balanced: {
    name: 'Balanced',
    description: 'Moderate risk, diversified portfolio',
    icon: <Target className="w-5 h-5" />,
    risk: 'Medium Risk',
    allocations: [
      { symbol: 'BTC', name: 'Bitcoin', percentage: 40, color: '#F7931A' },
      { symbol: 'ETH', name: 'Ethereum', percentage: 30, color: '#627EEA' },
      { symbol: 'SOL', name: 'Solana', percentage: 20, color: '#14F195' },
      { symbol: 'USDT', name: 'Other', percentage: 10, color: '#8B5CF6' },
    ],
  },
  aggressive: {
    name: 'Aggressive',
    description: 'High risk, maximum growth potential',
    icon: <Zap className="w-5 h-5" />,
    risk: 'High Risk',
    allocations: [
      { symbol: 'BTC', name: 'Bitcoin', percentage: 30, color: '#F7931A' },
      { symbol: 'ETH', name: 'Ethereum', percentage: 25, color: '#627EEA' },
      { symbol: 'SOL', name: 'Solana', percentage: 25, color: '#14F195' },
      { symbol: 'BNB', name: 'Altcoins', percentage: 20, color: '#F3BA2F' },
    ],
  },
};

export default function PortfolioBuilder() {
  const [selectedType, setSelectedType] = useState<PortfolioType>('balanced');
  const [investmentAmount, setInvestmentAmount] = useState<string>('1000');
  const [cryptoPrices, setCryptoPrices] = useState<Map<string, CryptoData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [calculated, setCalculated] = useState<CalculatedAllocation[]>([]);

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices?limit=50');
        const data: CryptoData[] = await response.json();
        const priceMap = new Map<string, CryptoData>();
        
        data.forEach(crypto => {
          priceMap.set(crypto.symbol.toUpperCase(), crypto);
        });
        
        setCryptoPrices(priceMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate allocations whenever inputs change
  useEffect(() => {
    const amount = parseFloat(investmentAmount) || 0;
    if (amount <= 0 || cryptoPrices.size === 0) {
      setCalculated([]);
      return;
    }

    const template = PORTFOLIO_TEMPLATES[selectedType];
    const calculatedAllocations: CalculatedAllocation[] = template.allocations.map(allocation => {
      const allocationAmount = (amount * allocation.percentage) / 100;
      const crypto = cryptoPrices.get(allocation.symbol);
      const currentPrice = crypto?.current_price || 0;
      const quantity = currentPrice > 0 ? allocationAmount / currentPrice : 0;

      return {
        ...allocation,
        amount: allocationAmount,
        quantity,
        currentPrice,
      };
    });

    setCalculated(calculatedAllocations);
  }, [selectedType, investmentAmount, cryptoPrices]);

  const portfolio = PORTFOLIO_TEMPLATES[selectedType];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <PieChart className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Builder</h2>
          <p className="text-gray-400 text-sm">Create your crypto investment strategy</p>
        </div>
      </div>

      {/* Portfolio Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(Object.keys(PORTFOLIO_TEMPLATES) as PortfolioType[]).map(type => {
          const template = PORTFOLIO_TEMPLATES[type];
          const isSelected = selectedType === type;
          
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                  {template.icon}
                </div>
                <h3 className={`font-semibold ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                  {template.name}
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">{template.description}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                type === 'conservative' ? 'bg-green-500/20 text-green-400' :
                type === 'balanced' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {template.risk}
              </span>
            </button>
          );
        })}
      </div>

      {/* Allocation Chart */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recommended Allocation</h3>
        
        {/* Visual Bar */}
        <div className="flex h-8 rounded-lg overflow-hidden mb-4">
          {portfolio.allocations.map((allocation, index) => (
            <div
              key={index}
              style={{ 
                width: `${allocation.percentage}%`,
                backgroundColor: allocation.color,
              }}
              className="flex items-center justify-center text-white text-xs font-medium transition-all hover:opacity-80"
            >
              {allocation.percentage}%
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {portfolio.allocations.map((allocation, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: allocation.color }}
              />
              <div>
                <div className="text-white text-sm font-medium">{allocation.symbol}</div>
                <div className="text-gray-400 text-xs">{allocation.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Amount Input */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <label className="block text-white font-semibold mb-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Investment Amount
          </div>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter amount..."
            min="0"
            step="100"
          />
        </div>
        <div className="flex gap-2 mt-3">
          {[500, 1000, 5000, 10000].map(amount => (
            <button
              key={amount}
              onClick={() => setInvestmentAmount(amount.toString())}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Breakdown */}
      {calculated.length > 0 && parseFloat(investmentAmount) > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Your Portfolio Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            {calculated.map((allocation, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: allocation.color }}
                    />
                    <div>
                      <div className="font-semibold text-white">{allocation.symbol}</div>
                      <div className="text-xs text-gray-400">{allocation.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      ${allocation.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">{allocation.percentage}%</div>
                  </div>
                </div>
                
                {allocation.currentPrice > 0 && (
                  <div className="pt-2 border-t border-gray-800 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Current Price:</span>
                      <span className="text-white">${allocation.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 mt-1">
                      <span>Quantity:</span>
                      <span className="text-white font-mono">{allocation.quantity.toFixed(6)} {allocation.symbol}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-semibold">Total Investment:</span>
              <span className="text-2xl font-bold text-white">
                ${parseFloat(investmentAmount).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-xs">
              ⚠️ <strong>Disclaimer:</strong> This is not financial advice. Cryptocurrency investments carry risk. 
              Always do your own research and never invest more than you can afford to lose.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-400">
          Loading current prices...
        </div>
      )}
    </div>
  );
}
