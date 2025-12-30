/**
 * Stock Price Chart Component
 * Displays historical stock price data using Alpha Vantage API
 * Features:
 * - Dynamic stock symbol input
 * - Line chart visualization using Recharts
 * - Loading and error states
 */
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Search, Loader, AlertCircle } from 'lucide-react';
import { fetchStockTimeSeries, StockTimeSeriesData } from '../services/stockApi';

export default function StockPriceChart() {
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<StockTimeSeriesData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch stock data when symbol changes or on search
   */
  const handleSearch = async () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setStockData([]);

    try {
      const data = await fetchStockTimeSeries(symbol.trim(), 'compact');
      
      if (data.length === 0) {
        setError('No data found for this symbol');
        return;
      }

      setStockData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format currency for display
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate price change
  const priceChange = stockData.length > 0
    ? stockData[stockData.length - 1].close - stockData[0].close
    : 0;
  const priceChangePercent = stockData.length > 0 && stockData[0].close > 0
    ? ((priceChange / stockData[0].close) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stock Price Chart</h2>
          <p className="text-sm text-slate-600">Historical price data powered by Alpha Vantage API</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !symbol.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
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

      {/* Chart Display */}
      {stockData.length > 0 && !loading && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Current Price</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(stockData[stockData.length - 1].close)}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Price Change</p>
              <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '+' : ''}{formatCurrency(priceChange)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-purple-600 font-semibold uppercase mb-1">Change %</p>
              <p className={`text-2xl font-bold ${parseFloat(priceChangePercent) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {parseFloat(priceChangePercent) >= 0 ? '+' : ''}{priceChangePercent}%
              </p>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Price Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Closing Price"
                />
                <Line
                  type="monotone"
                  dataKey="open"
                  stroke="#10b981"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Opening Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-slate-600 font-semibold">Date</th>
                    <th className="text-right py-2 px-3 text-slate-600 font-semibold">Open</th>
                    <th className="text-right py-2 px-3 text-slate-600 font-semibold">High</th>
                    <th className="text-right py-2 px-3 text-slate-600 font-semibold">Low</th>
                    <th className="text-right py-2 px-3 text-slate-600 font-semibold">Close</th>
                    <th className="text-right py-2 px-3 text-slate-600 font-semibold">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.slice(-10).reverse().map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-700">{formatDate(item.date)}</td>
                      <td className="py-2 px-3 text-slate-900 text-right">{formatCurrency(item.open)}</td>
                      <td className="py-2 px-3 text-slate-900 text-right">{formatCurrency(item.high)}</td>
                      <td className="py-2 px-3 text-slate-900 text-right">{formatCurrency(item.low)}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900 text-right">{formatCurrency(item.close)}</td>
                      <td className="py-2 px-3 text-slate-600 text-right">
                        {(item.volume / 1000000).toFixed(2)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stockData.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Enter a stock symbol to view price data</p>
        </div>
      )}
    </div>
  );
}

