/**
 * Automated Financial Reports Component
 * Generates comprehensive financial reports with AI insights
 * Features:
 * - Multiple data sources (stocks, crypto, portfolio)
 * - AI-generated executive summary and recommendations
 * - Interactive charts and tables
 * - PDF export with branding
 */
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Loader, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { generateFinancialReport, FinancialReport } from '../services/aiService';
import { fetchTopCryptocurrencies } from '../services/cryptoApi';
import { fetchStockTimeSeries } from '../services/stockApi';
import jsPDF from 'jspdf';

interface ReportData {
  stocks?: any[];
  crypto?: any[];
  portfolio?: {
    assets: number;
    liabilities: number;
    netWorth: number;
  };
  clientName?: string;
}

export default function AutomatedFinancialReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [stockSymbol, setStockSymbol] = useState<string>('AAPL');
  const [includeCrypto, setIncludeCrypto] = useState(true);
  const [includeStocks, setIncludeStocks] = useState(true);
  const [portfolioData, setPortfolioData] = useState({
    assets: 250000,
    liabilities: 50000,
    netWorth: 200000,
  });

  /**
   * Generate financial report
   */
  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const reportData: ReportData = {
        clientName: clientName || 'Client',
        portfolio: portfolioData,
      };

      // Fetch stock data if enabled
      if (includeStocks && stockSymbol) {
        try {
          const stockData = await fetchStockTimeSeries(stockSymbol, 'compact');
          reportData.stocks = stockData.slice(-30).map((item) => ({
            date: item.date,
            price: item.close,
            volume: item.volume,
          }));
        } catch (err) {
          console.warn('Failed to fetch stock data:', err);
        }
      }

      // Fetch crypto data if enabled
      if (includeCrypto) {
        try {
          const cryptoData = await fetchTopCryptocurrencies(5);
          reportData.crypto = cryptoData.map((coin) => ({
            name: coin.name,
            price: coin.current_price,
            change: coin.price_change_percentage_24h,
            marketCap: coin.market_cap,
          }));
        } catch (err) {
          console.warn('Failed to fetch crypto data:', err);
        }
      }

      // Generate AI report
      const generatedReport = await generateFinancialReport(reportData);
      setReport(generatedReport);
    } catch (err: any) {
      setError(err.message || 'Failed to generate financial report');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export report as PDF
   */
  const handleExportPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    let yPos = 20;

    // Header with branding
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Valunetics', 20, 25);
    doc.setFontSize(12);
    doc.text('Valunetics - Automated Financial Report', 20, 32);
    doc.setTextColor(0, 0, 0);

    yPos = 50;

    // Client Name and Date
    doc.setFontSize(14);
    doc.text(`Client: ${clientName || 'Client'}`, 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 10;

    // Executive Summary
    doc.setFontSize(14);
    doc.text('Executive Summary', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(report.executiveSummary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 5;

    // Key Metrics
    doc.setFontSize(14);
    doc.text('Key Metrics', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    report.keyMetrics.forEach((metric) => {
      doc.text(`${metric.label}: ${metric.value}${metric.change ? ` (${metric.change})` : ''}`, 20, yPos);
      yPos += 5;
    });

    yPos += 5;

    // Trends
    doc.setFontSize(14);
    doc.text('Key Trends', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    report.trends.forEach((trend) => {
      doc.text(`• ${trend}`, 20, yPos);
      yPos += 5;
    });

    yPos += 5;

    // Recommendations
    doc.setFontSize(14);
    doc.text('Recommendations', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    report.recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 20, yPos);
      yPos += 5;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This report is generated for informational purposes only. Consult with a qualified financial advisor for personalized advice.', 20, 280);

    // Save PDF
    doc.save(`financial-report-${clientName || 'client'}-${Date.now()}.pdf`);
  };

  /**
   * Format currency
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Prepare chart data
  const stockChartData = report?.charts.find(c => c.type === 'stock')?.data || [];
  const portfolioDataChart = [
    { name: 'Assets', value: portfolioData.assets },
    { name: 'Liabilities', value: portfolioData.liabilities },
    { name: 'Net Worth', value: portfolioData.netWorth },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Automated Financial Reports</h1>
                <p className="text-slate-600 mt-1">AI-powered comprehensive financial analysis</p>
              </div>
            </div>
            {report && (
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            )}
          </div>
        </div>

        {!report ? (
          /* Report Configuration */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Report Configuration</h2>
              
              <div className="space-y-6">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                  />
                </div>

                {/* Portfolio Data */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Assets ($)</label>
                      <input
                        type="number"
                        value={portfolioData.assets}
                        onChange={(e) => setPortfolioData({ ...portfolioData, assets: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Liabilities ($)</label>
                      <input
                        type="number"
                        value={portfolioData.liabilities}
                        onChange={(e) => setPortfolioData({ ...portfolioData, liabilities: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Net Worth ($)</label>
                      <input
                        type="number"
                        value={portfolioData.netWorth}
                        onChange={(e) => setPortfolioData({ ...portfolioData, netWorth: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Sources */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Sources</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeStocks}
                        onChange={(e) => setIncludeStocks(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-slate-700">Include Stock Data</span>
                    </label>
                    {includeStocks && (
                      <div className="ml-7">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Stock Symbol</label>
                        <input
                          type="text"
                          value={stockSymbol}
                          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                          placeholder="AAPL"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                        />
                      </div>
                    )}
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeCrypto}
                        onChange={(e) => setIncludeCrypto(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-slate-700">Include Cryptocurrency Data</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Report Preview</h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Client</p>
                  <p className="font-semibold text-slate-900">{clientName || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Portfolio Value</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(portfolioData.netWorth)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Data Sources</p>
                  <div className="space-y-1">
                    {includeStocks && <p className="text-sm text-slate-700">• Stock: {stockSymbol}</p>}
                    {includeCrypto && <p className="text-sm text-slate-700">• Cryptocurrency: Top 5</p>}
                    <p className="text-sm text-slate-700">• Portfolio Data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Report Display */
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Executive Summary</h2>
              <p className="text-slate-700 leading-relaxed">{report.executiveSummary}</p>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.keyMetrics.map((metric, index) => (
                  <div key={index} className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    {metric.change && (
                      <p className={`text-sm mt-1 ${metric.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                        {metric.change}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Key Trends
              </h2>
              <ul className="space-y-3">
                {report.trends.map((trend, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-semibold text-xs">{index + 1}</span>
                    </div>
                    <span className="text-slate-700">{trend}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portfolio Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Portfolio Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={portfolioDataChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Actionable Recommendations</h2>
              <div className="space-y-4">
                {report.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-slate-900 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                setReport(null);
                setError(null);
              }}
              className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Generate New Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

