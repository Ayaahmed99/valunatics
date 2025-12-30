import { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Calendar, Shield, Info } from 'lucide-react';

interface SimulationInputs {
  initialAmount: number;
  duration: number; // in years
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  monthlyContribution?: number;
}

interface ProjectionData {
  year: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

interface ScenarioResult {
  finalValue: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  volatility: number;
}

interface SimulationResults {
  conservative: ScenarioResult;
  moderate: ScenarioResult;
  aggressive: ScenarioResult;
  projections: ProjectionData[];
}

// Mock financial assumptions based on historical averages
const FINANCIAL_ASSUMPTIONS = {
  conservative: {
    annualReturn: 0.05, // 5% average annual return
    volatility: 0.08, // 8% volatility
    maxDrawdown: 0.15, // 15% max drawdown
    description: 'Bonds, CDs, Money Market Funds'
  },
  moderate: {
    annualReturn: 0.08, // 8% average annual return
    volatility: 0.12, // 12% volatility
    maxDrawdown: 0.25, // 25% max drawdown
    description: 'Balanced Portfolio (60% Stocks, 40% Bonds)'
  },
  aggressive: {
    annualReturn: 0.11, // 11% average annual return
    volatility: 0.18, // 18% volatility
    maxDrawdown: 0.40, // 40% max drawdown
    description: 'Growth Stocks, Equity Funds, Real Estate'
  }
};

// Calculate investment projection with compound interest and volatility simulation
function calculateProjection(
  initialAmount: number,
  duration: number,
  scenario: 'conservative' | 'moderate' | 'aggressive',
  monthlyContribution: number = 0
): ProjectionData[] {
  const assumptions = FINANCIAL_ASSUMPTIONS[scenario];
  const monthlyReturn = assumptions.annualReturn / 12;
  const monthlyVolatility = assumptions.volatility / Math.sqrt(12);
  
  const projections: ProjectionData[] = [];
  let conservativeValue = initialAmount;
  let moderateValue = initialAmount;
  let aggressiveValue = initialAmount;
  
  // Simulate with slight variations for realism
  for (let year = 0; year <= duration; year++) {
    if (year === 0) {
      projections.push({
        year,
        conservative: conservativeValue,
        moderate: moderateValue,
        aggressive: aggressiveValue
      });
      continue;
    }
    
    // Calculate for each scenario
    for (let month = 0; month < 12; month++) {
      // Add monthly contribution
      conservativeValue += monthlyContribution;
      moderateValue += monthlyContribution;
      aggressiveValue += monthlyContribution;
      
      // Apply returns with some variation
      const conservativeReturn = monthlyReturn + (Math.random() - 0.5) * monthlyVolatility * 0.5;
      const moderateReturn = monthlyReturn + (Math.random() - 0.5) * monthlyVolatility * 0.5;
      const aggressiveReturn = monthlyReturn + (Math.random() - 0.5) * monthlyVolatility * 0.5;
      
      conservativeValue *= (1 + conservativeReturn);
      moderateValue *= (1 + moderateReturn);
      aggressiveValue *= (1 + aggressiveReturn);
    }
    
    projections.push({
      year,
      conservative: Math.round(conservativeValue),
      moderate: Math.round(moderateValue),
      aggressive: Math.round(aggressiveValue)
    });
  }
  
  return projections;
}

// Calculate scenario results
function calculateScenarioResults(
  initialAmount: number,
  projections: ProjectionData[],
  scenario: 'conservative' | 'moderate' | 'aggressive'
): ScenarioResult {
  const finalValue = projections[projections.length - 1][scenario];
  const totalReturn = finalValue - initialAmount;
  const annualizedReturn = (Math.pow(finalValue / initialAmount, 1 / projections.length) - 1) * 100;
  const assumptions = FINANCIAL_ASSUMPTIONS[scenario];
  
  return {
    finalValue,
    totalReturn,
    annualizedReturn,
    maxDrawdown: assumptions.maxDrawdown * 100,
    volatility: assumptions.volatility * 100
  };
}

export default function InvestmentScenarioSimulator() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    initialAmount: 10000,
    duration: 10,
    riskTolerance: 'moderate',
    monthlyContribution: 0
  });
  
  const [hasRunSimulation, setHasRunSimulation] = useState(false);

  const results = useMemo<SimulationResults | null>(() => {
    if (!hasRunSimulation) return null;
    
    const projections = calculateProjection(
      inputs.initialAmount,
      inputs.duration,
      inputs.riskTolerance,
      inputs.monthlyContribution || 0
    );
    
    // Calculate all three scenarios for comparison
    const conservativeProjections = calculateProjection(
      inputs.initialAmount,
      inputs.duration,
      'conservative',
      inputs.monthlyContribution || 0
    );
    
    const moderateProjections = calculateProjection(
      inputs.initialAmount,
      inputs.duration,
      'moderate',
      inputs.monthlyContribution || 0
    );
    
    const aggressiveProjections = calculateProjection(
      inputs.initialAmount,
      inputs.duration,
      'aggressive',
      inputs.monthlyContribution || 0
    );
    
    // Combine projections
    const combinedProjections = conservativeProjections.map((_, index) => ({
      year: index,
      conservative: conservativeProjections[index].conservative,
      moderate: moderateProjections[index].moderate,
      aggressive: aggressiveProjections[index].aggressive
    }));
    
    return {
      conservative: calculateScenarioResults(inputs.initialAmount, conservativeProjections, 'conservative'),
      moderate: calculateScenarioResults(inputs.initialAmount, moderateProjections, 'moderate'),
      aggressive: calculateScenarioResults(inputs.initialAmount, aggressiveProjections, 'aggressive'),
      projections: combinedProjections
    };
  }, [inputs, hasRunSimulation]);

  const handleRunSimulation = () => {
    setHasRunSimulation(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Investment Scenario Simulator</h1>
              <p className="text-slate-600 mt-1">AI-powered projections for different investment strategies</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Investment Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Initial Investment Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={inputs.initialAmount}
                    onChange={(e) => setInputs({ ...inputs, initialAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Investment Duration (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={inputs.duration}
                    onChange={(e) => setInputs({ ...inputs, duration: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Contribution (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.monthlyContribution || 0}
                    onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Risk Tolerance
                  </label>
                  <select
                    value={inputs.riskTolerance}
                    onChange={(e) => setInputs({ ...inputs, riskTolerance: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {FINANCIAL_ASSUMPTIONS[inputs.riskTolerance].description}
                  </p>
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
                >
                  Run Simulation
                </button>
              </div>

              {/* Risk Warning */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">Important Disclaimer</p>
                    <p className="text-xs text-amber-800">
                      These projections are estimates based on historical averages and do not guarantee future returns. 
                      Past performance is not indicative of future results. Always consult with a qualified financial advisor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!hasRunSimulation ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Simulate</h3>
                <p className="text-slate-600">
                  Enter your investment parameters and click "Run Simulation" to see projections
                </p>
              </div>
            ) : results ? (
              <div className="space-y-6">
                {/* Projection Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Projection Comparison</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={results.projections}>
                      <defs>
                        <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorModerate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                        stroke="#64748b"
                      />
                      <YAxis 
                        label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                        stroke="#64748b"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="conservative" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorConservative)"
                        name="Conservative"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="moderate" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorModerate)"
                        name="Moderate"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="aggressive" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#colorAggressive)"
                        name="Aggressive"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Scenario Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conservative */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-bold text-slate-900">Conservative</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Final Value</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(results.conservative.finalValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Return</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(results.conservative.totalReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Annualized Return</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatPercent(results.conservative.annualizedReturn)}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Max Drawdown Risk</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {formatPercent(results.conservative.maxDrawdown)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Moderate */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h3 className="font-bold text-slate-900">Moderate</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Final Value</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(results.moderate.finalValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Return</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(results.moderate.totalReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Annualized Return</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatPercent(results.moderate.annualizedReturn)}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Max Drawdown Risk</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {formatPercent(results.moderate.maxDrawdown)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Aggressive */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <h3 className="font-bold text-slate-900">Aggressive</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Final Value</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(results.aggressive.finalValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Return</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(results.aggressive.totalReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Annualized Return</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatPercent(results.aggressive.annualizedReturn)}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Max Drawdown Risk</p>
                        <p className="text-sm font-semibold text-red-600">
                          {formatPercent(results.aggressive.maxDrawdown)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Comparison Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Risk & Return Comparison</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      {
                        name: 'Conservative',
                        return: results.conservative.annualizedReturn,
                        risk: results.conservative.volatility,
                        maxDrawdown: results.conservative.maxDrawdown
                      },
                      {
                        name: 'Moderate',
                        return: results.moderate.annualizedReturn,
                        risk: results.moderate.volatility,
                        maxDrawdown: results.moderate.maxDrawdown
                      },
                      {
                        name: 'Aggressive',
                        return: results.aggressive.annualizedReturn,
                        risk: results.aggressive.volatility,
                        maxDrawdown: results.aggressive.maxDrawdown
                      }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
                      <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatPercent(value) : ''} />
                      <Legend />
                      <Bar dataKey="return" fill="#3b82f6" name="Annualized Return" />
                      <Bar dataKey="risk" fill="#f59e0b" name="Volatility" />
                      <Bar dataKey="maxDrawdown" fill="#ef4444" name="Max Drawdown Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Risk Warnings */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    Risk Warnings
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-semibold text-red-900 mb-2">Aggressive Strategy Risks</p>
                      <p className="text-sm text-red-800">
                        Aggressive investments can experience significant volatility and potential losses up to {formatPercent(results.aggressive.maxDrawdown)}. 
                        Only suitable for investors with high risk tolerance and long investment horizons.
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="font-semibold text-amber-900 mb-2">Moderate Strategy Risks</p>
                      <p className="text-sm text-amber-800">
                        Moderate portfolios balance risk and return but can still experience drawdowns up to {formatPercent(results.moderate.maxDrawdown)}. 
                        Suitable for investors with medium risk tolerance.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-semibold text-blue-900 mb-2">Conservative Strategy Risks</p>
                      <p className="text-sm text-blue-800">
                        Conservative investments offer lower returns but also lower risk, with maximum drawdowns around {formatPercent(results.conservative.maxDrawdown)}. 
                        May not keep pace with inflation over long periods.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> These projections are based on historical market averages and simplified assumptions. 
                        Actual investment returns will vary based on market conditions, fees, taxes, and other factors. 
                        This tool is for educational purposes only and does not constitute financial advice. 
                        Always consult with a qualified financial advisor before making investment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

