/**
 * Currency Converter Component
 * Real-time currency conversion with exchange rate updates
 * Features:
 * - Convert between any two currencies
 * - Real-time exchange rates
 * - Clean, simple form interface
 * - Bidirectional conversion
 */
import { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeftRight, Loader, AlertCircle } from 'lucide-react';
import { fetchExchangeRate, getSupportedCurrencies, ExchangeRate } from '../services/currencyApi';

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currencies = getSupportedCurrencies();

  /**
   * Fetch exchange rate and convert amount
   */
  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      setExchangeRate(rate);
      setConvertedAmount(amount * rate.rate);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exchange rate');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Swap currencies
   */
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    // Recalculate after swap
    if (exchangeRate) {
      const newRate = 1 / exchangeRate.rate;
      setConvertedAmount(amount * newRate);
      setExchangeRate({
        ...exchangeRate,
        from: toCurrency,
        to: fromCurrency,
        rate: newRate,
      });
    }
  };

  /**
   * Auto-convert when amount or currencies change
   */
  useEffect(() => {
    if (amount > 0 && fromCurrency && toCurrency) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency]);

  /**
   * Format currency for display
   */
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-3 rounded-lg">
          <RefreshCw className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Currency Converter</h2>
          <p className="text-sm text-slate-600">Real-time exchange rates powered by exchangerate.host API</p>
        </div>
      </div>

      {/* Conversion Form */}
      <div className="space-y-6">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
          <div className="flex gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
            />
            <div className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg min-w-[200px]">
              <p className="text-xs text-slate-500 mb-1">Currency Name</p>
              <p className="font-semibold text-slate-900">{currencies[fromCurrency]}</p>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
          <div className="flex gap-3">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-slate-600">Converting...</span>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(convertedAmount, toCurrency)}
                  </p>
                </div>
              )}
            </div>
            <div className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg min-w-[200px]">
              <p className="text-xs text-slate-500 mb-1">Currency Name</p>
              <p className="font-semibold text-slate-900">{currencies[toCurrency]}</p>
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        {exchangeRate && !loading && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-900 mb-1">Exchange Rate</p>
                <p className="text-lg text-purple-800">
                  1 {exchangeRate.from} = {exchangeRate.rate.toFixed(4)} {exchangeRate.to}
                </p>
              </div>
              {lastUpdated && (
                <div className="text-right">
                  <p className="text-xs text-purple-600 mb-1">Last Updated</p>
                  <p className="text-xs text-purple-700">
                    {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Quick Convert Buttons */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-3">Quick Conversions</p>
          <div className="flex flex-wrap gap-2">
            {['100', '500', '1000', '5000'].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setAmount(parseFloat(value));
                  handleConvert();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                {fromCurrency} {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

