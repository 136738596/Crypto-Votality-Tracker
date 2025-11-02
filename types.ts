export interface CoinData {
  name: string;
  symbol: string;
  volatility1hPercentage: number;
  reason: string;
  currentPrice: number;
  volume24h: number;
}

export interface Alert {
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'above' | 'below';
  initialPrice: number;
}