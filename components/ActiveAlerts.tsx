import React from 'react';
import { Alert } from '../types';

interface ActiveAlertsProps {
  alerts: Alert[];
  onRemove: (symbol: string, targetPrice: number) => void;
}

const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ alerts, onRemove }) => {
  return (
    <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Active Price Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-gray-400">You have no active alerts.</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert, index) => (
            <li key={`${alert.symbol}-${alert.targetPrice}-${index}`} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
              <div>
                <span className="font-bold text-white">{alert.name} ({alert.symbol})</span>
                <span className="text-gray-300 ml-2">
                  - Notify when {alert.condition}{' '}
                  <span className="font-semibold text-blue-400">${alert.targetPrice.toLocaleString()}</span>
                </span>
                <span className="text-xs text-gray-500 ml-2">(Set at ${alert.initialPrice.toLocaleString()})</span>
              </div>
              <button
                onClick={() => onRemove(alert.symbol, alert.targetPrice)}
                className="text-red-400 hover:text-red-300 font-bold transition-colors"
                aria-label={`Remove alert for ${alert.name}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveAlerts;
