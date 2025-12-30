/**
 * Smart Budget Planner Component
 * AI-powered budget analysis and optimization
 * Features:
 * - CSV upload or manual expense entry
 * - AI-generated budget recommendations
 * - Interactive charts and sliders
 * - Category-wise budget adjustments
 */
import { useState, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, DollarSign, TrendingDown, TrendingUp, Sliders, Loader, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { generateBudgetAnalysis, BudgetAnalysis } from '../services/aiService';

interface Expense {
  category: string;
  amount: number;
}

const EXPENSE_CATEGORIES = [
  'Food',
  'Rent',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Travel',
  'Education',
  'Insurance',
  'Savings',
  'Other',
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#64748b'];

export default function SmartBudgetPlanner() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [budgetAdjustments, setBudgetAdjustments] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle CSV file upload
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedExpenses: Expense[] = results.data
            .filter((row: any) => row.category && row.amount)
            .map((row: any) => ({
              category: row.category.trim(),
              amount: parseFloat(row.amount) || 0,
            }));

          setExpenses(parsedExpenses);
          setError(null);
        } catch (err: any) {
          setError('Failed to parse CSV file. Please check the format.');
        }
      },
      error: (error) => {
        setError(`CSV parsing error: ${error.message}`);
      },
    });
  };

  /**
   * Add manual expense
   */
  const handleAddExpense = () => {
    setExpenses([...expenses, { category: 'Food', amount: 0 }]);
  };

  /**
   * Update expense
   */
  const handleUpdateExpense = (index: number, field: keyof Expense, value: string | number) => {
    const updated = [...expenses];
    updated[index] = {
      ...updated[index],
      [field]: typeof value === 'string' ? value : value,
    };
    setExpenses(updated);
  };

  /**
   * Remove expense
   */
  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  /**
   * Generate budget analysis
   */
  const handleAnalyze = async () => {
    if (expenses.length === 0) {
      setError('Please add expenses first');
      return;
    }

    if (income <= 0) {
      setError('Please enter a valid income amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysisResult = await generateBudgetAnalysis(expenses, income);
      setAnalysis(analysisResult);
      
      // Initialize budget adjustments with recommended values
      const adjustments: { [key: string]: number } = {};
      analysisResult.categoryBreakdown.forEach((cat) => {
        adjustments[cat.category] = cat.recommended;
      });
      setBudgetAdjustments(adjustments);
    } catch (err: any) {
      setError(err.message || 'Failed to generate budget analysis');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update budget adjustment
   */
  const handleBudgetAdjustment = (category: string, value: number) => {
    setBudgetAdjustments({
      ...budgetAdjustments,
      [category]: value,
    });
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
  const pieData = expenses.map((exp) => ({
    name: exp.category,
    value: exp.amount,
  }));

  const barData = analysis?.categoryBreakdown.map((cat) => ({
    category: cat.category,
    current: cat.current,
    recommended: budgetAdjustments[cat.category] || cat.recommended,
    difference: cat.current - (budgetAdjustments[cat.category] || cat.recommended),
  })) || [];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAdjusted = Object.values(budgetAdjustments).reduce((sum, val) => sum + val, 0) || analysis?.totalExpenses || 0;
  const savings = income - totalExpenses;
  const projectedSavings = income - totalAdjusted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Smart Budget Planner</h1>
              <p className="text-slate-600 mt-1">AI-powered budget analysis and optimization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Income Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Monthly Income</h2>
              <input
                type="number"
                value={income || ''}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                placeholder="Enter monthly income"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-900"
                min="0"
                step="100"
              />
            </div>

            {/* Expense Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Expenses</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={handleAddExpense}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 bg-slate-50 rounded-lg">
                    <select
                      value={expense.category}
                      onChange={(e) => handleUpdateExpense(index, 'category', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm bg-white text-slate-900"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={expense.amount || ''}
                      onChange={(e) => handleUpdateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Amount"
                      className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm bg-white text-slate-900"
                      min="0"
                      step="10"
                    />
                    <button
                      onClick={() => handleRemoveExpense(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {expenses.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No expenses added yet</p>
                  <p className="text-sm mt-2">Upload CSV or add manually</p>
                </div>
              )}

              {/* Summary */}
              {expenses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total Expenses:</span>
                    <span className="text-xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-600">Remaining:</span>
                    <span className={`text-lg font-semibold ${savings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(savings)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || expenses.length === 0 || income <= 0}
                className="w-full mt-4 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" />
                    Analyze Budget
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Current Savings</p>
                    <p className={`text-3xl font-bold ${savings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(savings)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Projected Savings</p>
                    <p className={`text-3xl font-bold ${projectedSavings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(projectedSavings)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Potential Savings</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(analysis.potentialSavings)}
                    </p>
                  </div>
                </div>

                {/* Expense Distribution Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Expense Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent?: number }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Budget Comparison Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Budget Comparison</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                      <Legend />
                      <Bar dataKey="current" fill="#ef4444" name="Current Spending" />
                      <Bar dataKey="recommended" fill="#10b981" name="Recommended Budget" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Budget Adjustments with Sliders */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-600" />
                    Adjust Budget Categories
                  </h3>
                  <div className="space-y-6">
                    {analysis.categoryBreakdown.map((cat) => {
                      const adjustedValue = budgetAdjustments[cat.category] || cat.recommended;
                      const difference = cat.current - adjustedValue;
                      
                      return (
                        <div key={cat.category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{cat.category}</p>
                              <p className="text-sm text-slate-600">
                                Current: {formatCurrency(cat.current)} | 
                                Recommended: {formatCurrency(cat.recommended)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{formatCurrency(adjustedValue)}</p>
                              {difference > 0 && (
                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  Save {formatCurrency(difference)}
                                </p>
                              )}
                              {difference < 0 && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Over by {formatCurrency(Math.abs(difference))}
                                </p>
                              )}
                            </div>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={cat.current * 1.5}
                            value={adjustedValue}
                            onChange={(e) => handleBudgetAdjustment(cat.category, parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">AI Recommendations</h3>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg">
                        <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-xs">{index + 1}</span>
                        </div>
                        <span className="text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Empty State */}
            {!analysis && !loading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Add expenses and click "Analyze Budget" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

