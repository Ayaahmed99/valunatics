/**
 * Financial Hub - Main Navigation Component
 * Modern, branded financial consultancy dashboard
 * Features: Sticky navigation, responsive design, brand color palette
 */
import { useState } from 'react';
import { MessageSquare, BarChart3, Home, TrendingUp, Building2, Target, Calculator, FileText, PieChart, Shield, Sparkles, Coins, RefreshCw, Menu, X, Info } from 'lucide-react';
import FinancialChat from './FinancialChat';
import FinancialAssessment from './FinancialAssessment';
import InvestmentScenarioSimulator from './InvestmentScenarioSimulator';
import StockPriceChart from './StockPriceChart';
import CompanyFinancialPanel from './CompanyFinancialPanel';
import CurrencyConverter from './CurrencyConverter';
import CryptoPricesDashboard from './CryptoPricesDashboard';
import GoalBasedFinancialPlanning from './GoalBasedFinancialPlanning';
import SmartBudgetPlanner from './SmartBudgetPlanner';
import AutomatedFinancialReports from './AutomatedFinancialReports';
import WealthManagementTools from './WealthManagementTools';
import AboutValunetics from './AboutValunetics';

type View = 'home' | 'chat' | 'assessment' | 'simulator' | 'stocks' | 'company' | 'currency' | 'crypto' | 'goals' | 'budget' | 'reports' | 'wealth' | 'about';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'planning' | 'analysis' | 'data' | 'tools';
}

export default function FinancialHub() {
  const [view, setView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      id: 'goals',
      icon: <Target className="w-5 h-5" />,
      title: 'Goal-Based Financial Planning',
      description: 'AI-powered personalized financial plans for your goals',
      category: 'planning'
    },
    {
      id: 'budget',
      icon: <Calculator className="w-5 h-5" />,
      title: 'Smart Budget Planner',
      description: 'Optimize your budget with AI analysis and recommendations',
      category: 'planning'
    },
    {
      id: 'wealth',
      icon: <PieChart className="w-5 h-5" />,
      title: 'Wealth Management Tools',
      description: 'Retirement planning, tax optimization, and estate planning',
      category: 'planning'
    },
    {
      id: 'assessment',
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Financial Health Assessment',
      description: 'Comprehensive evaluation of your financial situation',
      category: 'analysis'
    },
    {
      id: 'reports',
      icon: <FileText className="w-5 h-5" />,
      title: 'Automated Financial Reports',
      description: 'AI-generated insights and comprehensive financial reports',
      category: 'analysis'
    },
    {
      id: 'simulator',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Investment Scenario Simulator',
      description: 'Project investment outcomes with multiple risk scenarios',
      category: 'analysis'
    },
    {
      id: 'stocks',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Stock Price Chart',
      description: 'Real-time stock data with historical price trends',
      category: 'data'
    },
    {
      id: 'company',
      icon: <Building2 className="w-5 h-5" />,
      title: 'Company Financial Panel',
      description: 'Comprehensive financial data for public companies',
      category: 'data'
    },
    {
      id: 'currency',
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Currency Converter',
      description: 'Real-time currency conversion with live rates',
      category: 'data'
    },
    {
      id: 'crypto',
      icon: <Coins className="w-5 h-5" />,
      title: 'Crypto Prices Dashboard',
      description: 'Top cryptocurrencies with market data and trends',
      category: 'data'
    },
    {
      id: 'chat',
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'AI Financial Advisor Chat',
      description: 'Get instant answers to your financial questions',
      category: 'tools'
    },
    {
      id: 'about',
      icon: <Info className="w-5 h-5" />,
      title: 'About Valunetics',
      description: 'Learn about our company, mission, vision, and contact information',
      category: 'tools'
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    const viewMap: { [key: string]: View } = {
      'chat': 'chat',
      'assessment': 'assessment',
      'simulator': 'simulator',
      'stocks': 'stocks',
      'company': 'company',
      'currency': 'currency',
      'crypto': 'crypto',
      'goals': 'goals',
      'budget': 'budget',
      'reports': 'reports',
      'wealth': 'wealth',
      'about': 'about',
    };
    
    const selectedView = viewMap[featureId];
    if (selectedView) {
      setView(selectedView);
      setMobileMenuOpen(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'planning':
        return 'from-brand-green to-brand-green/80';
      case 'analysis':
        return 'from-brand-violetLight to-brand-violetDark';
      case 'data':
        return 'from-brand-violetLight to-brand-violetDark';
      case 'tools':
        return 'from-brand-green to-brand-violetLight';
      default:
        return 'from-brand-violetLight to-brand-violetDark';
    }
  };

  const renderView = () => {
    switch (view) {
      case 'chat':
        return <FinancialChat />;
      case 'assessment':
        return <FinancialAssessment />;
      case 'simulator':
        return <InvestmentScenarioSimulator />;
      case 'stocks':
        return <StockPriceChart />;
      case 'company':
        return <CompanyFinancialPanel />;
      case 'currency':
        return <CurrencyConverter />;
      case 'crypto':
        return <CryptoPricesDashboard />;
      case 'goals':
        return <GoalBasedFinancialPlanning />;
      case 'budget':
        return <SmartBudgetPlanner />;
      case 'reports':
        return <AutomatedFinancialReports />;
      case 'wealth':
        return <WealthManagementTools />;
      case 'about':
        return <AboutValunetics />;
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-brand-dark">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-violetDark via-brand-violetLight to-brand-violetDark">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                    <Sparkles className="w-4 h-4 text-brand-green" />
                    <span className="text-sm font-medium text-white">AI-Powered Financial Solutions</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                    Valunetics
                    <span className="block text-gradient">Financial Dashboard</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                    Comprehensive financial planning, analysis, and wealth management tools powered by advanced AI technology
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => handleFeatureClick('goals')}
                      className="px-8 py-4 bg-brand-green hover:bg-brand-green/90 text-brand-dark rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Start Planning
                    </button>
                    <button
                      onClick={() => handleFeatureClick('assessment')}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold transition-all duration-300"
                    >
                      Take Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Comprehensive financial solutions powered by advanced AI technology
                </p>
              </div>

              {/* Categorized Features */}
              {['planning', 'analysis', 'data', 'tools'].map((category) => {
                const categoryFeatures = features.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6 capitalize flex items-center gap-2">
                      <div className={`w-1 h-6 bg-gradient-to-b ${getCategoryColor(category)} rounded-full`}></div>
                      {category === 'planning' && 'Financial Planning'}
                      {category === 'analysis' && 'Financial Analysis'}
                      {category === 'data' && 'Market Data'}
                      {category === 'tools' && 'Tools & Resources'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryFeatures.map((feature) => (
                        <button
                          key={feature.id}
                          onClick={() => handleFeatureClick(feature.id)}
                          className="group relative bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left transition-all duration-300 hover:border-brand-green/50 hover:shadow-2xl hover:shadow-brand-green/20 card-hover"
                        >
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(feature.category)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <div className="text-white">
                              {feature.icon}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-green transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                          <div className="mt-4 flex items-center text-brand-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Get Started
                            <TrendingUp className="w-4 h-4 ml-2" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Trust Section */}
              <div className="mt-16 bg-gradient-to-r from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-brand-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">Professional Disclaimer</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Our AI-powered tools provide general information and educational guidance only. They are not a substitute for professional financial advice. Always consult with a qualified financial advisor for personalized recommendations tailored to your specific situation, risk tolerance, and financial goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="mt-12 text-center">
                <button
                  onClick={() => handleFeatureClick('about')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-green/50 text-white rounded-lg font-medium transition-all duration-300"
                >
                  <Info className="w-4 h-4" />
                  Learn More About Valunetics
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-violetDark/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-white hover:text-brand-green transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Valunetics</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleFeatureClick('about')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  view === 'about'
                    ? 'bg-brand-green text-brand-dark'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                About
              </button>
              {features.slice(0, 3).map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    view === feature.id
                      ? 'bg-brand-green text-brand-dark'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {feature.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-brand-green transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-brand-violetDark/98 backdrop-blur-md">
            <div className="px-4 py-4 space-y-2">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    view === feature.id
                      ? 'bg-brand-green text-brand-dark'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {feature.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Back Button */}
      {view !== 'home' && (
        <div className="bg-brand-violetDark/50 border-b border-white/10 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-white/70 hover:text-brand-green font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {renderView()}
      </div>
    </div>
  );
}
