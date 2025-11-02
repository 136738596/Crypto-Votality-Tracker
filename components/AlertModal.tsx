import React, { useState } from 'react';
import { CoinData, Alert } from '../types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetAlert: (alert: Omit<Alert, 'name' | 'initialPrice'>) => void;
  coin: CoinData | null;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onSetAlert, coin }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  if (!isOpen || !coin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!isNaN(price) && price > 0) {
      onSetAlert({
        symbol: coin.symbol,
        targetPrice: price,
        condition,
      });
      setTargetPrice('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Set Alert for {coin.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
        <p className="mb-4 text-gray-400">Current Price: <span className="font-semibold text-white">${coin.currentPrice.toLocaleString()}</span></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-2">Notify me when price is:</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setCondition('above')} className={`flex-1 p-3 rounded-md text-center font-semibold transition-colors ${condition === 'above' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Above</button>
              <button type="button" onClick={() => setCondition('below')} className={`flex-1 p-3 rounded-md text-center font-semibold transition-colors ${condition === 'below' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Below</button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-300 mb-2">Target Price (USD):</label>
            <input
              id="targetPrice"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g., 65000"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              step="any"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Set Alert</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertModal;
