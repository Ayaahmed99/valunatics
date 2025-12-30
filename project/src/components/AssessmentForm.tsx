import { useState } from 'react';
import { ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import type { AssessmentData } from './FinancialAssessment';

interface AssessmentFormProps {
  onSubmit: (data: AssessmentData) => Promise<void>;
  loading: boolean;
}

export default function AssessmentForm({ onSubmit, loading }: AssessmentFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    totalDebt: 0,
    savingsAmount: 0,
    emergencyFundMonths: 0,
    shortTermGoals: '',
    longTermGoals: '',
    riskTolerance: 'medium'
  });

  const totalSteps = 4;

  const handleInputChange = (field: keyof AssessmentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? (field.includes('Goals') ? value : parseFloat(value) || 0) : value
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return formData.monthlyIncome > 0;
      case 2:
        return formData.monthlyExpenses >= 0 && formData.totalDebt >= 0;
      case 3:
        return formData.savingsAmount >= 0 && formData.emergencyFundMonths >= 0;
      case 4:
        return formData.shortTermGoals.trim().length > 0 && formData.longTermGoals.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Financial Health Assessment</h1>
        <p className="text-slate-600 mb-8">Step {step} of {totalSteps}</p>

        <div className="mb-8">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8 min-h-80">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Income Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Gross Income ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.monthlyIncome || ''}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Include salary, bonuses, side income</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Expenses & Debt</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Expenses ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.monthlyExpenses || ''}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">All regular monthly expenses</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Debt ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.totalDebt || ''}
                    onChange={(e) => handleInputChange('totalDebt', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Credit cards, loans, mortgages</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Savings & Emergency Fund</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Savings Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.savingsAmount || ''}
                    onChange={(e) => handleInputChange('savingsAmount', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Total savings across all accounts</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Fund Coverage (months)</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.emergencyFundMonths || ''}
                    onChange={(e) => handleInputChange('emergencyFundMonths', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">How many months of expenses you can cover</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Goals & Risk Tolerance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Short-term Goals (next 1-3 years)</label>
                  <textarea
                    value={formData.shortTermGoals}
                    onChange={(e) => handleInputChange('shortTermGoals', e.target.value)}
                    placeholder="e.g., Save for vacation, pay off credit card debt"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Long-term Goals (3+ years)</label>
                  <textarea
                    value={formData.longTermGoals}
                    onChange={(e) => handleInputChange('longTermGoals', e.target.value)}
                    placeholder="e.g., Buy a home, retirement, education fund"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Risk Tolerance</label>
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map((tolerance) => (
                      <label key={tolerance} className="flex items-center">
                        <input
                          type="radio"
                          name="risk"
                          value={tolerance}
                          checked={formData.riskTolerance === tolerance}
                          onChange={(e) => handleInputChange('riskTolerance', e.target.value as 'low' | 'medium' | 'high')}
                          className="mr-2"
                        />
                        <span className="text-slate-700 capitalize">{tolerance === 'low' ? 'Low (Conservative)' : tolerance === 'medium' ? 'Medium (Balanced)' : 'High (Aggressive)'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                {step === totalSteps ? 'Complete Assessment' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
