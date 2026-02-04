'use client';

import { CryptoData, formatPrice, formatMarketCap, formatPercentage } from '@/lib/coingecko';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';

interface CryptoTableProps {
  cryptos: CryptoData[];
  isSimpleMode: boolean;
}

export default function CryptoTable({ cryptos, isSimpleMode }: CryptoTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-sm">
            <th className="text-left py-4 px-2">#</th>
            <th className="text-left py-4 px-2">Name</th>
            <th className="text-right py-4 px-2">Price</th>
            <th className="text-right py-4 px-2">24h %</th>
            {!isSimpleMode && <th className="text-right py-4 px-2">7d %</th>}
            <th className="text-right py-4 px-2">Market Cap</th>
            {!isSimpleMode && <th className="text-right py-4 px-2">Volume (24h)</th>}
            {!isSimpleMode && <th className="text-right py-4 px-2">Last 7 Days</th>}
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => (
            <tr 
              key={crypto.id} 
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-4 px-2 text-gray-400">{crypto.market_cap_rank}</td>
              <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                  <Image 
                    src={crypto.image} 
                    alt={crypto.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white">{crypto.name}</div>
                    <div className="text-gray-400 text-sm uppercase">{crypto.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2 text-right font-mono text-white">
                {formatPrice(crypto.current_price)}
              </td>
              <td className={`py-4 px-2 text-right font-mono ${
                crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <div className="flex items-center justify-end gap-1">
                  {crypto.price_change_percentage_24h >= 0 ? 
                    <TrendingUp size={14} /> : <TrendingDown size={14} />
                  }
                  {formatPercentage(crypto.price_change_percentage_24h)}
                </div>
              </td>
              {!isSimpleMode && (
                <td className={`py-4 px-2 text-right font-mono ${
                  (crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPercentage(crypto.price_change_percentage_7d_in_currency || 0)}
                </td>
              )}
              <td className="py-4 px-2 text-right text-gray-300">
                {formatMarketCap(crypto.market_cap)}
              </td>
              {!isSimpleMode && (
                <td className="py-4 px-2 text-right text-gray-300">
                  {formatMarketCap(crypto.total_volume)}
                </td>
              )}
              {!isSimpleMode && crypto.sparkline_in_7d && (
                <td className="py-4 px-2">
                  <MiniChart 
                    data={crypto.sparkline_in_7d.price} 
                    isPositive={(crypto.price_change_percentage_7d_in_currency || 0) >= 0}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniChart({ data, isPositive }: { data: number[], isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data
    .filter((_, i) => i % 4 === 0) // Sample every 4th point
    .map((price, i, arr) => {
      const x = (i / (arr.length - 1)) * 100;
      const y = 100 - ((price - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="100" height="32" className="ml-auto">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#4ade80' : '#f87171'}
        strokeWidth="1.5"
      />
    </svg>
  );
}
