import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssessmentRequest {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  savingsAmount: number;
  emergencyFundMonths: number;
  shortTermGoals: string;
  longTermGoals: string;
  riskTolerance: 'low' | 'medium' | 'high';
}

interface AssessmentResult {
  score: number;
  category: 'poor' | 'fair' | 'good' | 'excellent';
  riskAreas: string[];
  recommendations: string[];
  strengths: string[];
}

const calculateFinancialScore = (data: AssessmentRequest): AssessmentResult => {
  const scores = {
    savingsRate: 0,
    debtManagement: 0,
    emergencyFund: 0,
    expenseManagement: 0,
    goalPlanning: 0
  };

  // Savings rate score (0-25 points)
  const savingsRate = (data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome;
  if (savingsRate >= 0.25) scores.savingsRate = 25;
  else if (savingsRate >= 0.20) scores.savingsRate = 22;
  else if (savingsRate >= 0.15) scores.savingsRate = 20;
  else if (savingsRate >= 0.10) scores.savingsRate = 15;
  else if (savingsRate >= 0.05) scores.savingsRate = 10;
  else if (savingsRate > 0) scores.savingsRate = 5;
  else scores.savingsRate = 0;

  // Debt management score (0-25 points)
  const annualIncome = data.monthlyIncome * 12;
  const debtToIncomeRatio = data.totalDebt / annualIncome;
  if (debtToIncomeRatio <= 0.3) scores.debtManagement = 25;
  else if (debtToIncomeRatio <= 0.5) scores.debtManagement = 20;
  else if (debtToIncomeRatio <= 0.7) scores.debtManagement = 15;
  else if (debtToIncomeRatio <= 1.0) scores.debtManagement = 10;
  else scores.debtManagement = 5;

  // Emergency fund score (0-20 points)
  if (data.emergencyFundMonths >= 6) scores.emergencyFund = 20;
  else if (data.emergencyFundMonths >= 4) scores.emergencyFund = 16;
  else if (data.emergencyFundMonths >= 3) scores.emergencyFund = 12;
  else if (data.emergencyFundMonths >= 1) scores.emergencyFund = 8;
  else if (data.emergencyFundMonths > 0) scores.emergencyFund = 4;
  else scores.emergencyFund = 0;

  // Expense management score (0-15 points)
  const expenseRatio = data.monthlyExpenses / data.monthlyIncome;
  if (expenseRatio <= 0.5) scores.expenseManagement = 15;
  else if (expenseRatio <= 0.65) scores.expenseManagement = 12;
  else if (expenseRatio <= 0.75) scores.expenseManagement = 10;
  else if (expenseRatio <= 0.85) scores.expenseManagement = 7;
  else scores.expenseManagement = 3;

  // Goal planning score (0-15 points) - based on goals being set
  if (data.shortTermGoals && data.longTermGoals) scores.goalPlanning = 15;
  else if (data.shortTermGoals || data.longTermGoals) scores.goalPlanning = 8;
  else scores.goalPlanning = 0;

  const totalScore = Math.round(
    scores.savingsRate +
    scores.debtManagement +
    scores.emergencyFund +
    scores.expenseManagement +
    scores.goalPlanning
  );

  const riskAreas: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // Identify risk areas and strengths
  if (savingsRate < 0.05) {
    riskAreas.push('Very low savings rate - you\'re spending most or all of your income');
  } else if (savingsRate < 0.10) {
    riskAreas.push('Low savings rate - consider increasing your monthly savings');
  } else {
    strengths.push(`Healthy savings rate of ${(savingsRate * 100).toFixed(1)}%`);
  }

  if (debtToIncomeRatio > 1.0) {
    riskAreas.push(`High debt-to-income ratio of ${(debtToIncomeRatio * 100).toFixed(1)}% - debt exceeds annual income`);
  } else if (debtToIncomeRatio > 0.7) {
    riskAreas.push(`Elevated debt-to-income ratio of ${(debtToIncomeRatio * 100).toFixed(1)}% - consider debt reduction strategy`);
  } else if (debtToIncomeRatio <= 0.3) {
    strengths.push(`Excellent debt management with a ${(debtToIncomeRatio * 100).toFixed(1)}% debt-to-income ratio`);
  }

  if (data.emergencyFundMonths < 3) {
    riskAreas.push(`Insufficient emergency fund - you have coverage for only ${data.emergencyFundMonths.toFixed(1)} months of expenses`);
  } else if (data.emergencyFundMonths >= 6) {
    strengths.push(`Strong emergency fund with ${data.emergencyFundMonths.toFixed(1)} months of coverage`);
  }

  if (data.monthlyExpenses > data.monthlyIncome) {
    riskAreas.push('Monthly expenses exceed income - you\'re running a deficit');
  } else if ((data.monthlyExpenses / data.monthlyIncome) > 0.85) {
    riskAreas.push('Expenses are consuming over 85% of income - limited flexibility for emergencies');
  }

  // Generate recommendations
  if (savingsRate < 0.10) {
    recommendations.push('Increase your monthly savings to at least 10% of income. Review expenses and identify areas to reduce.');
  }

  if (debtToIncomeRatio > 0.5) {
    recommendations.push('Create a debt reduction strategy. Focus on paying down high-interest debt first (credit cards, personal loans).');
  }

  if (data.emergencyFundMonths < 3) {
    recommendations.push('Build an emergency fund covering 3-6 months of expenses. Set up automatic monthly transfers to savings.');
  }

  if (data.monthlyExpenses > data.monthlyIncome * 0.85) {
    recommendations.push('Review and reduce discretionary spending. Create a detailed budget tracking each expense category.');
  }

  if (data.shortTermGoals || data.longTermGoals) {
    recommendations.push('Create a timeline and savings plan for your goals. Break long-term goals into smaller milestones.');
  } else {
    recommendations.push('Define clear short and long-term financial goals. Having specific targets helps motivate saving and investing.');
  }

  if (data.savingsAmount > 0) {
    recommendations.push('Consider diversifying your savings across high-yield savings accounts and appropriate investments based on your risk tolerance.');
  }

  const category: 'poor' | 'fair' | 'good' | 'excellent' =
    totalScore >= 80 ? 'excellent' :
    totalScore >= 60 ? 'good' :
    totalScore >= 40 ? 'fair' :
    'poor';

  return {
    score: totalScore,
    category,
    riskAreas,
    recommendations,
    strengths
  };
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: AssessmentRequest = await req.json();

    if (!data.monthlyIncome || !data.shortTermGoals || !data.longTermGoals) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = calculateFinancialScore(data);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
