import { AlertTriangle, TrendingUp, Lightbulb, CheckCircle, RotateCcw } from 'lucide-react';
import type { AssessmentResult, AssessmentData } from './FinancialAssessment';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onReset: () => void;
  data: AssessmentData | null;
}

export default function AssessmentResults({ result, onReset, data }: AssessmentResultsProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'excellent':
        return 'from-emerald-500 to-emerald-600';
      case 'good':
        return 'from-blue-500 to-blue-600';
      case 'fair':
        return 'from-amber-500 to-amber-600';
      case 'poor':
        return 'from-red-500 to-red-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  const savingsRate = data ? ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome * 100).toFixed(1) : 0;
  const debtToIncomeRatio = data ? (data.totalDebt / (data.monthlyIncome * 12) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${getCategoryColor(result.category)} p-8 text-white`}>
            <p className="text-sm font-semibold opacity-90 mb-2">Your Financial Health Score</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold mb-2">{result.score}</div>
                <p className="text-xl">{getCategoryLabel(result.category)}</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-light opacity-20">/100</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Assessment Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Monthly Savings Rate</p>
                <p className="text-2xl font-bold text-slate-900">{savingsRate}%</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs text-amber-600 font-semibold uppercase mb-1">Debt-to-Income Ratio</p>
                <p className="text-2xl font-bold text-slate-900">{debtToIncomeRatio}%</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Emergency Fund</p>
                <p className="text-2xl font-bold text-slate-900">{data?.emergencyFundMonths || 0} months</p>
              </div>
            </div>
          </div>
        </div>

        {result.strengths.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              Your Strengths
            </h3>
            <ul className="space-y-3">
              {result.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-slate-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.riskAreas.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Areas of Concern
            </h3>
            <ul className="space-y-3">
              {result.riskAreas.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-slate-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-500" />
            Actionable Recommendations
          </h3>
          <ul className="space-y-4">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 pb-4 border-b border-slate-200 last:border-0">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-900">
            <strong>Disclaimer:</strong> This assessment provides general guidance based on the information you provided. For personalized financial advice tailored to your specific situation, consult with a qualified financial advisor.
          </p>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Take Assessment Again
        </button>
      </div>
    </div>
  );
}
