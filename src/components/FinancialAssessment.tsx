import { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import AssessmentForm from './AssessmentForm';
import AssessmentResults from './AssessmentResults';

export interface AssessmentData {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  savingsAmount: number;
  emergencyFundMonths: number;
  shortTermGoals: string;
  longTermGoals: string;
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface AssessmentResult {
  score: number;
  category: 'poor' | 'fair' | 'good' | 'excellent';
  riskAreas: string[];
  recommendations: string[];
  strengths: string[];
}

export default function FinancialAssessment() {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAssessmentSubmit = async (data: AssessmentData) => {
    setAssessmentData(data);
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/financial-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setResults(result);
      setStep('results');
    } catch (error) {
      console.error('Assessment error:', error);
      alert('Failed to complete assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setAssessmentData(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        {step === 'form' ? (
          <AssessmentForm onSubmit={handleAssessmentSubmit} loading={loading} />
        ) : results ? (
          <AssessmentResults result={results} onReset={handleReset} data={assessmentData} />
        ) : null}
      </div>
    </div>
  );
}
