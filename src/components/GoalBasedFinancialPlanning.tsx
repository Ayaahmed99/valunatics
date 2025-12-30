/**
 * Goal-Based Financial Planning Component
 * Multi-step form for financial goal planning with AI-generated plans
 * Features:
 * - Multi-step user input form
 * - AI-powered financial plan generation
 * - Progress visualization with Recharts
 * - PDF export functionality
 */
import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target, ChevronRight, ChevronLeft, Download, Loader, CheckCircle, TrendingUp } from 'lucide-react';
import { generateFinancialPlan, FinancialPlanRequest, FinancialPlan, MonthlyPlan } from '../services/aiService';
import jsPDF from 'jspdf';

type GoalType = 'retirement' | 'home' | 'education' | 'wealth';
type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

interface FormData {
  age: number;
  income: number;
  currentSavings: number;
  targetGoal: GoalType;
  targetAmount: number;
  timeHorizon: number;
  riskTolerance: RiskTolerance;
}

export default function GoalBasedFinancialPlanning() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<FinancialPlan | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    age: 30,
    income: 75000,
    currentSavings: 10000,
    targetGoal: 'retirement',
    targetAmount: 1000000,
    timeHorizon: 30,
    riskTolerance: 'moderate',
  });

  const totalSteps = 4;

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value,
    }));
  };

  /**
   * Navigate to next step
   */
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleGeneratePlan();
    }
  };

  /**
   * Navigate to previous step
   */
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  /**
   * Validate current step
   */
  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return formData.age > 0 && formData.income > 0 && formData.currentSavings >= 0;
      case 2:
        return formData.targetAmount > 0 && formData.timeHorizon > 0;
      case 3:
        return true; // Goal type selection
      case 4:
        return true; // Risk tolerance selection
      default:
        return false;
    }
  };

  /**
   * Generate financial plan using AI
   */
  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: FinancialPlanRequest = {
        age: formData.age,
        income: formData.income,
        currentSavings: formData.currentSavings,
        targetGoal: formData.targetGoal,
        targetAmount: formData.targetAmount,
        timeHorizon: formData.timeHorizon,
        riskTolerance: formData.riskTolerance,
      };

      const generatedPlan = await generateFinancialPlan(request);
      setPlan(generatedPlan);
    } catch (err: any) {
      setError(err.message || 'Failed to generate financial plan');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export plan as PDF
   */
  const handleExportPDF = () => {
    if (!plan) return;

    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.text('Valunetics - Financial Plan Report', 20, yPos);
    yPos += 10;

    // Summary
    doc.setFontSize(12);
    doc.text('Summary:', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(plan.summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 5;

    // Recommendations
    doc.setFontSize(12);
    doc.text('Recommendations:', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    plan.recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 20, yPos);
      yPos += 5;
    });

    yPos += 5;

    // Milestones
    doc.setFontSize(12);
    doc.text('Key Milestones:', 20, yPos);
    yPos += 5;
    doc.setFontSize(10);
    plan.milestones.forEach((milestone) => {
      doc.text(`• ${milestone}`, 20, yPos);
      yPos += 5;
    });

    // Save PDF
    doc.save(`financial-plan-${formData.targetGoal}-${Date.now()}.pdf`);
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
  const chartData = plan?.monthlyPlans.map((p, index) => ({
    month: index + 1,
    savings: p.savings,
    investments: p.investments,
    total: p.total,
    target: formData.targetAmount,
  })) || [];

  return (
    <div className="min-h-screen bg-brand-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-green to-brand-violetLight p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Goal-Based Financial Planning</h1>
              <p className="text-white/70 mt-1">AI-powered financial planning tailored to your goals</p>
            </div>
          </div>
        </div>

        {!plan ? (
          /* Multi-Step Form */
          <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 md:p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">Step {step} of {totalSteps}</span>
                <span className="text-sm text-slate-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-green to-brand-violetLight h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-white placeholder-white/40 focus:bg-white/10"
                      min="18"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Annual Income ($)</label>
                    <input
                      type="number"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-white placeholder-white/40 focus:bg-white/10"
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Current Savings ($)</label>
                    <input
                      type="number"
                      value={formData.currentSavings}
                      onChange={(e) => handleInputChange('currentSavings', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-white placeholder-white/40 focus:bg-white/10"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goal Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Goal Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Target Amount ($)</label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => handleInputChange('targetAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Time Horizon (Years)</label>
                    <input
                      type="number"
                      value={formData.timeHorizon}
                      onChange={(e) => handleInputChange('timeHorizon', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="1"
                      max="50"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      How many years until you want to achieve this goal?
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goal Type */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Select Your Goal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['retirement', 'home', 'education', 'wealth'] as GoalType[]).map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleInputChange('targetGoal', goal)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        formData.targetGoal === goal
                          ? 'border-brand-green bg-brand-green/20 shadow-lg shadow-brand-green/20'
                          : 'border-white/20 hover:border-brand-green/50 bg-white/5'
                      }`}
                    >
                      <h3 className="font-semibold text-white capitalize mb-2">{goal}</h3>
                      <p className="text-sm text-white/70">
                        {goal === 'retirement' && 'Plan for a secure retirement'}
                        {goal === 'home' && 'Save for your dream home'}
                        {goal === 'education' && 'Fund education expenses'}
                        {goal === 'wealth' && 'Build long-term wealth'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Risk Tolerance */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Risk Tolerance</h2>
                <div className="space-y-4">
                  {(['conservative', 'moderate', 'aggressive'] as RiskTolerance[]).map((risk) => (
                    <button
                      key={risk}
                      onClick={() => handleInputChange('riskTolerance', risk)}
                      className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                        formData.riskTolerance === risk
                          ? 'border-brand-green bg-brand-green/20 shadow-lg shadow-brand-green/20'
                          : 'border-white/20 hover:border-brand-green/50 bg-white/5'
                      }`}
                    >
                      <h3 className="font-semibold text-white capitalize mb-2">{risk}</h3>
                      <p className="text-sm text-white/70">
                        {risk === 'conservative' && 'Lower risk, steady returns (Bonds, CDs)'}
                        {risk === 'moderate' && 'Balanced approach (60% Stocks, 40% Bonds)'}
                        {risk === 'aggressive' && 'Higher risk, higher potential returns (Growth Stocks)'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1 || loading}
                className="flex items-center gap-2 px-6 py-2 border border-white/20 rounded-lg text-white/70 font-medium hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-green to-brand-violetLight hover:from-brand-green/90 hover:to-brand-violetLight/90 disabled:bg-white/10 disabled:text-white/50 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    {step === totalSteps ? 'Generate Plan' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* Plan Results */
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Your Financial Plan</h2>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-green to-brand-violetLight hover:from-brand-green/90 hover:to-brand-violetLight/90 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">{plan.summary}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-brand-green/20 border border-brand-green/30 rounded-lg p-4">
                  <p className="text-xs text-brand-green font-semibold uppercase mb-1">Target Amount</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(formData.targetAmount)}</p>
                </div>
                <div className="bg-brand-violetLight/20 border border-brand-violetLight/30 rounded-lg p-4">
                  <p className="text-xs text-brand-violetLight font-semibold uppercase mb-1">Time Horizon</p>
                  <p className="text-2xl font-bold text-white">{formData.timeHorizon} Years</p>
                </div>
                <div className="bg-brand-green/20 border border-brand-green/30 rounded-lg p-4">
                  <p className="text-xs text-brand-green font-semibold uppercase mb-1">Current Savings</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(formData.currentSavings)}</p>
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ec17c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ec17c" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} stroke="rgba(255,255,255,0.7)" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                    contentStyle={{ backgroundColor: '#170454', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="total" stroke="#0ec17c" fillOpacity={1} fill="url(#colorTotal)" name="Total Value" />
                  <Line type="monotone" dataKey="target" stroke="#2a008d" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-green" />
                Recommendations
              </h3>
              <ul className="space-y-3">
                {plan.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-dark font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-black/80">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Milestones */}
            <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-green" />
                Key Milestones
              </h3>
              <div className="space-y-4">
                {plan.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-brand-violetLight rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-black font-medium">{milestone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setPlan(null);
                setStep(1);
                setError(null);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-brand-violetLight to-brand-violetDark hover:from-brand-violetLight/90 hover:to-brand-violetDark/90 text-white rounded-lg font-medium transition-all duration-300 shadow-lg"
            >
              Create New Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

