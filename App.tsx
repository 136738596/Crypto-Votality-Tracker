import React, { useState, useEffect, useCallback } from 'react';
import { CoinData, Alert } from './types';
import { fetchVolatileCoins } from './services/geminiService';
import Header from './components/Header';
import CoinCard from './components/CoinCard';
import LoadingSpinner from './components/LoadingSpinner';
import AlertModal from './components/AlertModal';
import ActiveAlerts from './components/ActiveAlerts';

const App: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const checkAlerts = useCallback((updatedCoins: CoinData[]) => {
    setAlerts(currentAlerts => {
      const triggeredAlerts: Alert[] = [];
      const remainingAlerts = currentAlerts.filter(alert => {
        const coin = updatedCoins.find(c => c.symbol === alert.symbol);
        if (!coin) return true; // Keep alert if coin not in current volatile list

        const price = coin.currentPrice;
        if (alert.condition === 'above' && price >= alert.targetPrice) {
          triggeredAlerts.push(alert);
          return false;
        }
        if (alert.condition === 'below' && price <= alert.targetPrice) {
          triggeredAlerts.push(alert);
          return false;
        }
        return true;
      });

      if (triggeredAlerts.length > 0) {
        const message = triggeredAlerts
          .map(a => `${a.name} reached your target of $${a.targetPrice}.`)
          .join(' ');
        setNotification(message);
        setTimeout(() => setNotification(null), 5000);
      }

      return remainingAlerts;
    });
  }, []);

  const loadCoinData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsInitialLoading(true);
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await fetchVolatileCoins();
      setCoins(data);
      checkAlerts(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      if (!isRefresh) setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [checkAlerts]);

  useEffect(() => {
    loadCoinData();
    const interval = setInterval(() => loadCoinData(true), 15000);
    return () => clearInterval(interval);
  }, [loadCoinData]);

  const handleOpenAlertModal = (coin: CoinData) => {
    setSelectedCoin(coin);
    setIsAlertModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedCoin(null);
  };

  const handleSetAlert = (alert: Omit<Alert, 'name' | 'initialPrice'>) => {
    if (selectedCoin) {
      setAlerts(prev => [...prev, { ...alert, name: selectedCoin.name, initialPrice: selectedCoin.currentPrice }]);
    }
    handleCloseAlertModal();
  };
  
  const handleRemoveAlert = (symbol: string, targetPrice: number) => {
      setAlerts(prev => prev.filter(a => !(a.symbol === symbol && a.targetPrice === targetPrice)));
  }

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="flex items-center justify-center pt-24">
            <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center mt-10 p-6 bg-red-900/50 border border-red-700 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-red-300">An Error Occurred</h3>
          <p className="text-red-400 mt-2">{error}</p>
          <button
            onClick={() => loadCoinData()}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <>
        {alerts.length > 0 && <ActiveAlerts alerts={alerts} onRemove={handleRemoveAlert}/>}
        <div className="flex flex-col gap-3 max-w-5xl mx-auto">
          {coins.map((coin, index) => (
            <CoinCard key={coin.symbol} coin={coin} onSetAlert={handleOpenAlertModal} rank={index + 1} />
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/40 z-0"></div>
        <div className="relative z-10">
          <Header onRefresh={() => loadCoinData(true)} isLoading={isRefreshing} />
          <main className="p-4 md:p-8">
              {renderContent()}
          </main>
        </div>
      </div>
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-bold">Price Alert Triggered!</p>
          <p>{notification}</p>
        </div>
      )}
      {selectedCoin && (
        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={handleCloseAlertModal}
          onSetAlert={handleSetAlert}
          coin={selectedCoin}
        />
      )}
    </>
  );
};

export default App;
