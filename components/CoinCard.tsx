import React from 'react';
import { CoinData } from '../types';

interface CoinCardProps {
  coin: CoinData;
  onSetAlert: (coin: CoinData) => void;
  rank: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
}

const formatVolume = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onSetAlert, rank }) => {
  const isPositive = coin.volatility1hPercentage >= 0;
  const percentageColor = isPositive ? 'text-green-400' : 'text-red-400';
  const formattedPercentage = `${isPositive ? '+' : ''}${coin.volatility1hPercentage.toFixed(2)}%`;

  const rankClasses: { [key: number]: string } = {
    1: 'border-yellow-400',
    2: 'border-gray-300',
    3: 'border-orange-400',
  };
  const borderClass = rankClasses[rank] || 'border-gray-700';

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border-l-4 ${borderClass} rounded-lg p-3 shadow-lg hover:shadow-blue-500/20 hover:bg-gray-800 transition-all duration-300 flex items-center gap-4`}>
        {/* Rank */}
        <div className="flex-shrink-0 w-8 text-center">
            <span className="text-xl font-bold text-gray-400">{rank}</span>
        </div>

        {/* Symbol Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-lg border-2 border-gray-600">
            {coin.symbol.charAt(0)}
        </div>
        
        {/* Name & Symbol */}
        <div className="flex-grow">
            <h3 className="text-md font-bold text-white">{coin.name}</h3>
            <p className="text-sm text-gray-400">{coin.symbol}</p>
        </div>

        {/* Price & Volume */}
        <div className="flex-shrink-0 text-right w-32 md:w-40">
            <p className="text-md font-semibold text-white">{formatCurrency(coin.currentPrice)}</p>
            <p className="text-gray-400 text-xs">Vol: ${formatVolume(coin.volume24h)}</p>
        </div>

        {/* 1h Change */}
        <div className="flex-shrink-0 text-right w-24 md:w-28">
            <span className={`font-bold text-lg ${percentageColor}`}>
                {formattedPercentage}
            </span>
            <p className="text-xs text-gray-500">1h Change</p>
        </div>
        
        {/* Alert Button */}
        <div className="flex-shrink-0">
            <button 
                onClick={() => onSetAlert(coin)} 
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-700" 
                aria-label={`Set alert for ${coin.name}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </button>
        </div>
    </div>
  );
};

export default CoinCard;
