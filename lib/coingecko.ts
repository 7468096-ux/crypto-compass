// CoinGecko API integration
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  total_volume: number;
  circulating_supply: number;
  sparkline_in_7d?: { price: number[] };
}

export async function getTopCryptos(limit: number = 10): Promise<CryptoData[]> {
  const response = await fetch(
    `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h,7d`,
    { next: { revalidate: 300 } } // Cache for 5 minutes
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  
  return response.json();
}

export async function getHistoricalData(coinId: string, days: number = 30) {
  const response = await fetch(
    `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  
  return response.json();
}

export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toLocaleString()}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
