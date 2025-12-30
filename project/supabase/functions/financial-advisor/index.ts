import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FINANCIAL_SYSTEM_PROMPT = `You are a professional financial consultant providing general educational guidance. Your responses must:

1. Always start with: "This is general information, not financial advice."
2. Focus on educational content about financial concepts
3. Explain general principles without recommending specific investments
4. Suggest consulting qualified advisors for personalized recommendations
5. Mention relevant regulations and risks when appropriate
6. Use professional, trustworthy language
7. Avoid predicting market movements or guaranteeing returns
8. Never provide specific investment tips or stock recommendations
9. Explain concepts clearly for different knowledge levels
10. Encourage proper financial planning and diversification principles

When answering questions:
- Identify the underlying financial concept
- Provide educational context
- Explain relevant factors to consider
- Recommend professional consultation where appropriate
- Use specific disclaimers for sensitive topics`;

interface RequestBody {
  question: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

const generateFinancialGuidance = (question: string): string => {
  const questionLower = question.toLowerCase();

  const responses: Record<string, string> = {
    budget: "This is general information, not financial advice. Budgeting is the foundation of personal finance. A common approach is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Start by tracking your income and expenses for a month to understand your spending patterns. Consider using budgeting tools to categorize expenses. The key is consistency and reviewing your budget quarterly. A qualified financial advisor can help you create a personalized budget strategy.",

    savings: "This is general information, not financial advice. Building an emergency fund with 3-6 months of expenses is generally recommended. High-yield savings accounts offer better rates than traditional savings accounts. Consider automating transfers to savings to build the habit. The best savings strategy depends on your income stability and goals. Consult a financial advisor to create a comprehensive savings and investment plan.",

    debt: "This is general information, not financial advice. High-interest debt (like credit cards) should generally be addressed first. Two common approaches are the avalanche method (highest interest first) and the snowball method (smallest balance first). Both require consistent monthly payments above minimums. Consolidation may be an option, but requires careful evaluation. A financial advisor can help you choose the best debt repayment strategy for your situation.",

    invest: "This is general information, not financial advice. Investment fundamentals include diversification, understanding risk tolerance, and investing for the long term. Common investment vehicles include stocks, bonds, mutual funds, and ETFs. Past performance doesn't guarantee future results. Risk increases with potential returns. Before investing, build an emergency fund and understand your goals and timeline. A qualified financial advisor can recommend an appropriate investment strategy based on your individual situation.",

    retirement: "This is general information, not financial advice. Retirement planning involves estimating expenses, understanding income sources (Social Security, pensions, savings), and creating a withdrawal strategy. Retirement accounts like 401(k)s and IRAs offer tax advantages. The earlier you start saving, the more time compound growth can work for you. Retirement needs vary greatly by individual. Consult a financial advisor for a personalized retirement plan.",

    tax: "This is general information, not financial advice. Tax planning should be part of your overall financial strategy. Consider retirement account contributions, charitable donations, and tax-loss harvesting. Tax laws change regularly. Keep organized records of income and deductions. A tax professional can help you optimize your tax situation and ensure compliance.",

    credit: "This is general information, not financial advice. Credit scores range from 300-850 and are based on payment history, credit utilization, length of history, and more. Paying bills on time is crucial. Keep credit card balances low (under 30% of limits). Check your credit report for errors. A higher score typically means better loan rates. Improving credit takes time but is worthwhile."
  };

  for (const [key, response] of Object.entries(responses)) {
    if (questionLower.includes(key)) {
      return response;
    }
  }

  return `This is general information, not financial advice. Your question touches on important financial concepts. Generally, sound financial management involves: understanding your current situation, setting clear goals, creating a plan to achieve them, and reviewing progress regularly. Key principles include living within your means, building an emergency fund, managing debt wisely, and planning for the future. The specific approach depends on your individual circumstances, so consulting with a qualified financial advisor is recommended for personalized guidance.`;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body: RequestBody = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = generateFinancialGuidance(question);

    return new Response(
      JSON.stringify({ response }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
