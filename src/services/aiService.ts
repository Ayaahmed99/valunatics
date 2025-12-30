/**
 * AI Service for Financial Planning
 * Integrates with OpenAI GPT API or similar AI services
 * 
 * API Key: Get from https://platform.openai.com/api-keys
 * Alternative: Use Supabase Edge Functions with AI integration
 */
import apiClient from './api';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_BASE_URL = 'https://api.openai.com/v1/chat/completions';

// Alternative: Use Supabase Edge Function for AI
const SUPABASE_AI_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/financial-ai`
  : null;

export interface FinancialPlanRequest {
  age: number;
  income: number;
  currentSavings: number;
  targetGoal: 'retirement' | 'home' | 'education' | 'wealth';
  targetAmount: number;
  timeHorizon: number; // in years
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface MonthlyPlan {
  month: number;
  savings: number;
  investments: number;
  total: number;
  milestone: string;
}

export interface FinancialPlan {
  summary: string;
  monthlyPlans: MonthlyPlan[];
  recommendations: string[];
  milestones: string[];
}

export interface BudgetAnalysis {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categoryBreakdown: {
    category: string;
    current: number;
    recommended: number;
    difference: number;
  }[];
  recommendations: string[];
  potentialSavings: number;
}

export interface FinancialReport {
  executiveSummary: string;
  trends: string[];
  keyMetrics: {
    label: string;
    value: string;
    change?: string;
  }[];
  recommendations: string[];
  charts: {
    type: string;
    data: any[];
  }[];
}

/**
 * Generate goal-based financial plan using AI
 */
export const generateFinancialPlan = async (
  request: FinancialPlanRequest
): Promise<FinancialPlan> => {
  try {
    // If using Supabase Edge Function
    if (SUPABASE_AI_FUNCTION_URL) {
      const response = await apiClient.post(SUPABASE_AI_FUNCTION_URL, {
        type: 'financial_plan',
        data: request,
      });
      return response.data;
    }

    // If using OpenAI directly
    if (OPENAI_API_KEY) {
      const prompt = `As a financial advisor, create a detailed month-by-month financial plan for:
- Age: ${request.age}
- Annual Income: $${request.income.toLocaleString()}
- Current Savings: $${request.currentSavings.toLocaleString()}
- Goal: ${request.targetGoal}
- Target Amount: $${request.targetAmount.toLocaleString()}
- Time Horizon: ${request.timeHorizon} years
- Risk Tolerance: ${request.riskTolerance}

Provide a JSON response with:
1. A summary paragraph
2. Monthly plans with savings, investments, and milestones
3. Key recommendations
4. Major milestones

Format as JSON with structure: {summary, monthlyPlans: [{month, savings, investments, total, milestone}], recommendations: [], milestones: []}`;

      const response = await apiClient.post(
        OPENAI_BASE_URL,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional financial advisor. Provide detailed, actionable financial plans in JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const plan = JSON.parse(content);
      return plan;
    }

    // Fallback: Generate mock plan based on calculations
    return generateMockFinancialPlan(request);
  } catch (error: any) {
    console.error('AI Plan Generation Error:', error);
    // Fallback to mock plan
    return generateMockFinancialPlan(request);
  }
};

/**
 * Generate budget analysis using AI
 */
export const generateBudgetAnalysis = async (
  expenses: { category: string; amount: number }[],
  income: number
): Promise<BudgetAnalysis> => {
  try {
    if (SUPABASE_AI_FUNCTION_URL) {
      const response = await apiClient.post(SUPABASE_AI_FUNCTION_URL, {
        type: 'budget_analysis',
        data: { expenses, income },
      });
      return response.data;
    }

    if (OPENAI_API_KEY) {
      const prompt = `Analyze this budget:
Income: $${income.toLocaleString()}
Expenses: ${JSON.stringify(expenses)}

Provide recommendations for:
1. Category-wise budget optimization
2. Potential savings
3. Overspending alerts

Return JSON: {totalIncome, totalExpenses, savings, categoryBreakdown: [{category, current, recommended, difference}], recommendations: [], potentialSavings}`;

      const response = await apiClient.post(
        OPENAI_BASE_URL,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor specializing in budget optimization.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    }

    // Fallback: Generate mock analysis
    return generateMockBudgetAnalysis(expenses, income);
  } catch (error: any) {
    console.error('AI Budget Analysis Error:', error);
    return generateMockBudgetAnalysis(expenses, income);
  }
};

/**
 * Generate financial report insights
 */
export const generateFinancialReport = async (
  data: any
): Promise<FinancialReport> => {
  try {
    if (SUPABASE_AI_FUNCTION_URL) {
      const response = await apiClient.post(SUPABASE_AI_FUNCTION_URL, {
        type: 'financial_report',
        data,
      });
      return response.data;
    }

    if (OPENAI_API_KEY) {
      const prompt = `Generate a comprehensive financial report with:
1. Executive summary
2. Key trends
3. Important metrics
4. Actionable recommendations

Data: ${JSON.stringify(data)}

Return JSON format.`;

      const response = await apiClient.post(
        OPENAI_BASE_URL,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a financial analyst. Generate professional financial reports.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    }

    // Fallback: Mock report
    return generateMockFinancialReport(data);
  } catch (error: any) {
    console.error('AI Report Generation Error:', error);
    return generateMockFinancialReport(data);
  }
};

// Mock implementations for fallback
function generateMockFinancialPlan(request: FinancialPlanRequest): FinancialPlan {
  const monthlySavings = (request.targetAmount - request.currentSavings) / (request.timeHorizon * 12);
  const monthlyPlans: MonthlyPlan[] = [];
  
  for (let month = 1; month <= request.timeHorizon * 12; month++) {
    const savings = monthlySavings * 0.6;
    const investments = monthlySavings * 0.4;
    monthlyPlans.push({
      month,
      savings: savings * month,
      investments: investments * month * (1 + (request.riskTolerance === 'aggressive' ? 0.01 : 0.005)),
      total: request.currentSavings + savings * month + investments * month,
      milestone: month % 12 === 0 ? `Year ${Math.floor(month / 12)} milestone` : '',
    });
  }

  return {
    summary: `Based on your goal to ${request.targetGoal} with a target of $${request.targetAmount.toLocaleString()} in ${request.timeHorizon} years, we recommend a ${request.riskTolerance} investment strategy with monthly savings of $${monthlySavings.toFixed(2)}.`,
    monthlyPlans,
    recommendations: [
      'Automate monthly savings transfers',
      'Diversify investments based on risk tolerance',
      'Review and adjust plan quarterly',
      'Consider tax-advantaged accounts',
    ],
    milestones: [
      `Month 12: Reach $${(request.currentSavings + monthlySavings * 12).toFixed(0)}`,
      `Month 24: Reach $${(request.currentSavings + monthlySavings * 24).toFixed(0)}`,
      `Month ${request.timeHorizon * 12}: Achieve target of $${request.targetAmount.toLocaleString()}`,
    ],
  };
}

function generateMockBudgetAnalysis(
  expenses: { category: string; amount: number }[],
  income: number
): BudgetAnalysis {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savings = income - totalExpenses;
  
  // Recommended budget: 50/30/20 rule with category adjustments
  const categoryBreakdown = expenses.map((exp) => {
    const recommended = exp.amount * 0.9; // Suggest 10% reduction
    return {
      category: exp.category,
      current: exp.amount,
      recommended,
      difference: exp.amount - recommended,
    };
  });

  return {
    totalIncome: income,
    totalExpenses,
    savings,
    categoryBreakdown,
    recommendations: [
      'Reduce discretionary spending by 10%',
      'Consider negotiating bills and subscriptions',
      'Build emergency fund with savings',
    ],
    potentialSavings: totalExpenses * 0.1,
  };
}

function generateMockFinancialReport(data: any): FinancialReport {
  return {
    executiveSummary: 'Your financial portfolio shows steady growth with diversified investments. Key areas for optimization include tax efficiency and rebalancing.',
    trends: [
      'Portfolio value increased 8% over the last quarter',
      'Stock allocation slightly above target',
      'Emergency fund fully funded',
    ],
    keyMetrics: [
      { label: 'Total Assets', value: '$250,000', change: '+8%' },
      { label: 'Net Worth', value: '$200,000', change: '+10%' },
      { label: 'Debt-to-Income', value: '25%', change: '-2%' },
    ],
    recommendations: [
      'Rebalance portfolio to target allocation',
      'Maximize 401(k) contributions',
      'Consider tax-loss harvesting',
    ],
    charts: [],
  };
}

