/**
 * Company Financial Panel Component
 * Displays comprehensive financial data for companies
 * Features:
 * - Company profile and key metrics
 * - Income statement, balance sheet, cash flow
 * - Search by ticker symbol
 * - Card-based layout with responsive design
 */
import { useState } from 'react';
import { Building2, Search, Loader, AlertCircle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import {
  fetchCompanyProfile,
  fetchIncomeStatement,
  fetchBalanceSheet,
  fetchCashFlow,
  fetchKeyMetrics,
  CompanyProfile,
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  KeyMetrics,
} from '../services/financialApi';

export default function CompanyFinancialPanel() {
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement[]>([]);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null);

  /**
   * Fetch all financial data for a company
   */
  const handleSearch = async () => {
    if (!symbol.trim()) {
      setError('Please enter a company ticker symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setProfile(null);
    setIncomeStatement([]);
    setBalanceSheet([]);
    setCashFlow([]);
    setKeyMetrics(null);

    try {
      // Fetch all data in parallel for better performance
      const [profileData, incomeData, balanceData, cashData, metricsData] = await Promise.all([
        fetchCompanyProfile(symbol.trim()),
        fetchIncomeStatement(symbol.trim()),
        fetchBalanceSheet(symbol.trim()),
        fetchCashFlow(symbol.trim()),
        fetchKeyMetrics(symbol.trim()),
      ]);

      if (!profileData) {
        setError('Company not found. Please check the ticker symbol.');
        return;
      }

      setProfile(profileData);
      setIncomeStatement(incomeData);
      setBalanceSheet(balanceData);
      setCashFlow(cashData);
      setKeyMetrics(metricsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch company financial data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format large numbers with abbreviations
   */
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  /**
   * Format percentage
   */
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Building2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Company Financial Panel</h2>
          <p className="text-sm text-slate-600">Comprehensive financial data powered by Financial Modeling Prep API</p>
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
              placeholder="Enter company ticker (e.g., AAPL, MSFT, GOOGL)"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !symbol.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
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

      {/* Company Profile */}
      {profile && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{profile.companyName}</h3>
              <p className="text-slate-600 mb-4">{profile.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Symbol</p>
                  <p className="font-semibold text-slate-900">{profile.symbol}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sector</p>
                  <p className="font-semibold text-slate-900">{profile.sector}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Industry</p>
                  <p className="font-semibold text-slate-900">{profile.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Market Cap</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(profile.marketCap)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {keyMetrics && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Key Financial Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-semibold uppercase mb-1">P/E Ratio</p>
              <p className="text-2xl font-bold text-slate-900">{keyMetrics.peRatio.toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-purple-600 font-semibold uppercase mb-1">Price to Book</p>
              <p className="text-2xl font-bold text-slate-900">{keyMetrics.priceToBook.toFixed(2)}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">ROE</p>
              <p className="text-2xl font-bold text-slate-900">{formatPercent(keyMetrics.returnOnEquity)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-xs text-orange-600 font-semibold uppercase mb-1">Profit Margin</p>
              <p className="text-2xl font-bold text-slate-900">{formatPercent(keyMetrics.profitMargin)}</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4">
              <p className="text-xs text-cyan-600 font-semibold uppercase mb-1">Debt to Equity</p>
              <p className="text-2xl font-bold text-slate-900">{keyMetrics.debtToEquity.toFixed(2)}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-xs text-pink-600 font-semibold uppercase mb-1">Current Ratio</p>
              <p className="text-2xl font-bold text-slate-900">{keyMetrics.currentRatio.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">ROA</p>
              <p className="text-2xl font-bold text-slate-900">{formatPercent(keyMetrics.returnOnAssets)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Statements */}
      {incomeStatement.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Income Statement */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Income Statement
            </h3>
            <div className="space-y-3">
              {incomeStatement.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">{item.date}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Revenue:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Net Income:</span>
                      <span className={`font-semibold ${item.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(item.netIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">EPS:</span>
                      <span className="font-semibold text-slate-900">${item.eps.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance Sheet */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Balance Sheet
            </h3>
            <div className="space-y-3">
              {balanceSheet.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">{item.date}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Assets:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(item.totalAssets)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Equity:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(item.totalEquity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cash:</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(item.cashAndCashEquivalents)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Flow */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Cash Flow
            </h3>
            <div className="space-y-3">
              {cashFlow.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">{item.date}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Operating CF:</span>
                      <span className={`font-semibold ${item.operatingCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(item.operatingCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Free Cash Flow:</span>
                      <span className={`font-semibold ${item.freeCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(item.freeCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CapEx:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(Math.abs(item.capitalExpenditure))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!profile && !loading && !error && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Enter a company ticker symbol to view financial data</p>
        </div>
      )}
    </div>
  );
}

