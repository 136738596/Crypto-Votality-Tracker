
import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const RefreshIcon = ({ isLoading }: { isLoading: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading }) => {
  return (
    <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          AI Crypto Volatility Tracker
        </h1>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <RefreshIcon isLoading={isLoading} />
        <span className="ml-2 hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
      </button>
    </header>
  );
};

export default Header;
