import { useState } from 'react';
import { MessageSquare, BarChart3, Home } from 'lucide-react';
import FinancialChat from './FinancialChat';
import FinancialAssessment from './FinancialAssessment';

type View = 'home' | 'chat' | 'assessment';

export default function FinancialHub() {
  const [view, setView] = useState<View>('home');

  const renderView = () => {
    switch (view) {
      case 'chat':
        return <FinancialChat />;
      case 'assessment':
        return <FinancialAssessment />;
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Financial Advisor Suite</h1>
                <p className="text-lg text-slate-600">Comprehensive financial guidance and assessment tools</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setView('chat')}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl p-8 text-left transition-all hover:scale-105"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Financial Advisor Chat</h2>
                  <p className="text-slate-600 mb-4">Ask general financial questions and receive educational guidance on budgeting, investing, debt management, and more.</p>
                  <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">Get Guidance</span>
                </button>

                <button
                  onClick={() => setView('assessment')}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl p-8 text-left transition-all hover:scale-105"
                >
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Financial Health Assessment</h2>
                  <p className="text-slate-600 mb-4">Take a comprehensive assessment to evaluate your financial health, identify areas of concern, and get personalized recommendations.</p>
                  <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium">Start Assessment</span>
                </button>
              </div>

              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-sm text-blue-900">
                  <strong>Disclaimer:</strong> This financial advisor suite provides general information and guidance only. It is not financial advice. Always consult with a qualified financial advisor for personalized recommendations tailored to your specific situation.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {view !== 'home' && (
        <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      )}
      <div className="flex-1">
        {renderView()}
      </div>
    </div>
  );
}
