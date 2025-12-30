/**
 * Wealth Management Tools Component
 * Comprehensive wealth management with retirement, tax, and estate planning
 * Features:
 * - Retirement savings projections
 * - Investment simulations
 * - Tax optimization suggestions
 * - Estate planning recommendations
 * - Interactive charts and scenarios
 */
import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, Shield, Loader, AlertCircle } from 'lucide-react';

interface WealthData {
  age: number;
  retirementAge: number;
  currentIncome: number;
  currentAssets: number;
  currentLiabilities: number;
  monthlySavings: number;
  investmentReturn: number;
  taxBracket: number;
  estateValue: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

interface RetirementProjection {
  age: number;
  savings: number;
  investments: number;
  total: number;
}

interface AssetAllocation {
  category: string;
  percentage: number;
  value: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function WealthManagementTools() {
  const [wealthData, setWealthData] = useState<WealthData>({
    age: 35,
    retirementAge: 65,
    currentIncome: 100000,
    currentAssets: 250000,
    currentLiabilities: 50000,
    monthlySavings: 2000,
    investmentReturn: 7,
    taxBracket: 22,
    estateValue: 500000,
    riskTolerance: 'moderate',
  });

  const [loading, setLoading] = useState(false);
  const [projections, setProjections] = useState<RetirementProjection[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([]);

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof WealthData, value: string | number) => {
    setWealthData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value,
    }));
  };

  /**
   * Calculate retirement projections
   */
  const calculateRetirementProjection = () => {
    setLoading(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const yearsToRetirement = wealthData.retirementAge - wealthData.age;
      const monthlyReturn = wealthData.investmentReturn / 100 / 12;
      const projections: RetirementProjection[] = [];
      
      let currentSavings = wealthData.currentAssets - wealthData.currentLiabilities;
      
      for (let year = 0; year <= yearsToRetirement; year++) {
        const age = wealthData.age + year;
        const months = year * 12;
        
        // Calculate compound growth with monthly contributions
        let savings = currentSavings;
        let investments = 0;
        
        for (let month = 0; month < 12; month++) {
          savings += wealthData.monthlySavings;
          investments = savings * monthlyReturn;
          savings += investments;
        }
        
        currentSavings = savings;
        
        projections.push({
          age,
          savings: savings * 0.6, // Conservative estimate
          investments: savings * 0.4,
          total: savings,
        });
      }
      
      setProjections(projections);
      
      // Calculate asset allocation based on risk tolerance
      const allocation: AssetAllocation[] = [
        {
          category: 'Stocks',
          percentage: wealthData.riskTolerance === 'aggressive' ? 80 : wealthData.riskTolerance === 'moderate' ? 60 : 40,
          value: (wealthData.currentAssets - wealthData.currentLiabilities) * (wealthData.riskTolerance === 'aggressive' ? 0.8 : wealthData.riskTolerance === 'moderate' ? 0.6 : 0.4),
        },
        {
          category: 'Bonds',
          percentage: wealthData.riskTolerance === 'aggressive' ? 10 : wealthData.riskTolerance === 'moderate' ? 30 : 50,
          value: (wealthData.currentAssets - wealthData.currentLiabilities) * (wealthData.riskTolerance === 'aggressive' ? 0.1 : wealthData.riskTolerance === 'moderate' ? 0.3 : 0.5),
        },
        {
          category: 'Real Estate',
          percentage: 10,
          value: (wealthData.currentAssets - wealthData.currentLiabilities) * 0.1,
        },
      ];
      
      setAssetAllocation(allocation);
      setLoading(false);
    }, 1000);
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

  const netWorth = wealthData.currentAssets - wealthData.currentLiabilities;
  const retirementSavings = projections.length > 0 ? projections[projections.length - 1].total : 0;
  const annualRetirementIncome = retirementSavings * 0.04; // 4% withdrawal rule

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Wealth Management Tools</h1>
              <p className="text-slate-600 mt-1">Comprehensive wealth planning and optimization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Wealth Profile</h2>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Age</label>
                      <input
                        type="number"
                        value={wealthData.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="18"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Retirement Age</label>
                      <input
                        type="number"
                        value={wealthData.retirementAge}
                        onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="50"
                        max="80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income ($)</label>
                      <input
                        type="number"
                        value={wealthData.currentIncome}
                        onChange={(e) => handleInputChange('currentIncome', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>

                {/* Assets & Liabilities */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Assets & Liabilities</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Assets ($)</label>
                      <input
                        type="number"
                        value={wealthData.currentAssets}
                        onChange={(e) => handleInputChange('currentAssets', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Liabilities ($)</label>
                      <input
                        type="number"
                        value={wealthData.currentLiabilities}
                        onChange={(e) => handleInputChange('currentLiabilities', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Net Worth</p>
                      <p className="text-xl font-bold text-slate-900">{formatCurrency(netWorth)}</p>
                    </div>
                  </div>
                </div>

                {/* Savings & Investment */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Savings & Investment</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Savings ($)</label>
                      <input
                        type="number"
                        value={wealthData.monthlySavings}
                        onChange={(e) => handleInputChange('monthlySavings', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        step="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expected Annual Return (%)</label>
                      <input
                        type="number"
                        value={wealthData.investmentReturn}
                        onChange={(e) => handleInputChange('investmentReturn', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        max="20"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Risk Tolerance</label>
                      <select
                        value={wealthData.riskTolerance}
                        onChange={(e) => handleInputChange('riskTolerance', e.target.value as any)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                      >
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tax & Estate */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Tax & Estate</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tax Bracket (%)</label>
                      <input
                        type="number"
                        value={wealthData.taxBracket}
                        onChange={(e) => handleInputChange('taxBracket', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        max="50"
                        step="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Estate Value ($)</label>
                      <input
                        type="number"
                        value={wealthData.estateValue}
                        onChange={(e) => handleInputChange('estateValue', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                        min="0"
                        step="10000"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculateRetirementProjection}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Calculate Projections
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            {projections.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-xs text-teal-600 font-semibold uppercase mb-2">Retirement Savings</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(retirementSavings)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Annual Retirement Income</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(annualRetirementIncome)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-xs text-emerald-600 font-semibold uppercase mb-2">Years to Retirement</p>
                  <p className="text-2xl font-bold text-slate-900">{wealthData.retirementAge - wealthData.age} Years</p>
                </div>
              </div>
            )}

            {/* Retirement Projection Chart */}
            {projections.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Retirement Savings Projection</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={projections}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                    <Legend />
                    <Area type="monotone" dataKey="total" stroke="#14b8a6" fillOpacity={1} fill="url(#colorTotal)" name="Total Wealth" />
                    <Area type="monotone" dataKey="savings" stroke="#3b82f6" fillOpacity={0.5} fill="#3b82f6" name="Savings" />
                    <Area type="monotone" dataKey="investments" stroke="#10b981" fillOpacity={0.5} fill="#10b981" name="Investments" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Asset Allocation */}
            {assetAllocation.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended Asset Allocation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent?: number }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {assetAllocation.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number | undefined) => value !== undefined ? `${value}%` : ''} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {assetAllocation.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="font-semibold text-slate-900">{asset.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{asset.percentage}%</p>
                          <p className="text-sm text-slate-600">{formatCurrency(asset.value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tax Optimization */}
            {projections.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Tax Optimization Suggestions</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold text-slate-900 mb-2">Maximize 401(k) Contributions</p>
                    <p className="text-sm text-slate-700">
                      Contribute up to $22,500 annually (2023 limit) to reduce taxable income by {wealthData.taxBracket}%.
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-600">
                    <p className="font-semibold text-slate-900 mb-2">Consider Roth IRA</p>
                    <p className="text-sm text-slate-700">
                      Contribute to Roth IRA for tax-free withdrawals in retirement. Current limit: $6,500 annually.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                    <p className="font-semibold text-slate-900 mb-2">Tax-Loss Harvesting</p>
                    <p className="text-sm text-slate-700">
                      Offset capital gains with losses to reduce tax liability. Review portfolio quarterly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Estate Planning */}
            {projections.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Estate Planning Recommendations</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-900 mb-2">Estate Value</p>
                    <p className="text-2xl font-bold text-slate-900 mb-4">{formatCurrency(wealthData.estateValue)}</p>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p>• Consider establishing a trust to minimize estate taxes</p>
                      <p>• Review beneficiary designations on all accounts annually</p>
                      <p>• Consult with an estate attorney for comprehensive planning</p>
                      <p>• Consider gifting strategies to reduce taxable estate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {projections.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <PieChartIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Enter your wealth information and click "Calculate Projections" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

