/**
 * Crypto Prices Dashboard Component
 * Displays top cryptocurrencies with real-time prices
 * Features:
 * - Top 10 cryptocurrencies by market cap
 * - Price, 24h change, and market cap
 * - Responsive table layout
 * - Auto-refresh capability
 */
import { useState, useEffect } from 'react';
import { Coins, RefreshCw, TrendingUp, TrendingDown, Loader, AlertCircle } from 'lucide-react';
import { fetchTopCryptocurrencies, Cryptocurrency } from '../services/cryptoApi';

export default function CryptoPricesDashboard() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  /**
   * Fetch cryptocurrency data
   */
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTopCryptocurrencies(10);
      setCryptos(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Auto-refresh every 60 seconds if enabled
   */
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchData();
      }, 60000); // Refresh every 60 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  /**
   * Format currency for display
   */
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  /**
   * Format percentage with color
   */
  const formatPercent = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={isPositive ? 'text-emerald-600' : 'text-red-600'}>
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Coins className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Crypto Prices Dashboard</h2>
            <p className="text-sm text-slate-600">Top 10 cryptocurrencies by market cap</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="text-xs text-slate-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Auto-refresh Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="autoRefresh"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
          className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="autoRefresh" className="text-sm text-slate-700">
          Auto-refresh every 60 seconds
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && cryptos.length === 0 && (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading cryptocurrency data...</p>
        </div>
      )}

      {/* Crypto Table */}
      {cryptos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">24h Change</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Market Cap</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map((crypto, index) => (
                <tr
                  key={crypto.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-600">
                        #{crypto.market_cap_rank || index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{crypto.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(crypto.current_price)}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      {formatPercent(crypto.price_change_percentage_24h)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(crypto.market_cap)}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm text-slate-600">
                      {formatCurrency(crypto.total_volume)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {cryptos.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-xs text-orange-600 font-semibold uppercase mb-1">Total Market Cap</p>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0))}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Total Volume (24h)</p>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(cryptos.reduce((sum, crypto) => sum + crypto.total_volume, 0))}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Average 24h Change</p>
            <p className="text-xl font-bold text-slate-900">
              {formatPercent(
                cryptos.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) /
                  cryptos.length
              )}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && cryptos.length === 0 && !error && (
        <div className="text-center py-12">
          <Coins className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No cryptocurrency data available</p>
        </div>
      )}
    </div>
  );
}

