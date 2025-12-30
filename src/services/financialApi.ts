/**
 * Financial Modeling Prep API Service
 * Fetches company financial statements and key metrics
 * 
 * API Key: Get free API key from https://site.financialmodelingprep.com/developer/docs/
 * Free tier: 250 requests/day
 */
import apiClient from './api';

const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY || 'demo';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

export interface CompanyProfile {
  symbol: string;
  companyName: string;
  currency: string;
  exchange: string;
  industry: string;
  sector: string;
  marketCap: number;
  description: string;
  website: string;
  ceo: string;
  employees: number;
}

export interface IncomeStatement {
  date: string;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
}

export interface BalanceSheet {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  cashAndCashEquivalents: number;
  totalDebt: number;
}

export interface CashFlow {
  date: string;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
}

export interface KeyMetrics {
  peRatio: number;
  priceToBook: number;
  debtToEquity: number;
  currentRatio: number;
  returnOnEquity: number;
  returnOnAssets: number;
  profitMargin: number;
}

/**
 * Fetch company profile information
 */
export const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile | null> => {
  try {
    const response = await apiClient.get(`${FMP_BASE_URL}/profile/${symbol.toUpperCase()}`, {
      params: {
        apikey: FMP_API_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    const data = response.data[0];
    return {
      symbol: data.symbol,
      companyName: data.companyName,
      currency: data.currency,
      exchange: data.exchangeShortName,
      industry: data.industry,
      sector: data.sector,
      marketCap: data.mktCap || 0,
      description: data.description,
      website: data.website,
      ceo: data.ceo,
      employees: data.fullTimeEmployees || 0,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch company profile: ${error.message}`);
  }
};

/**
 * Fetch income statement (annual)
 */
export const fetchIncomeStatement = async (symbol: string): Promise<IncomeStatement[]> => {
  try {
    const response = await apiClient.get(`${FMP_BASE_URL}/income-statement/${symbol.toUpperCase()}`, {
      params: {
        period: 'annual',
        limit: 5,
        apikey: FMP_API_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((item: any) => ({
      date: item.date,
      revenue: item.revenue || 0,
      grossProfit: item.grossProfit || 0,
      operatingIncome: item.operatingIncome || 0,
      netIncome: item.netIncome || 0,
      eps: item.eps || 0,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch income statement: ${error.message}`);
  }
};

/**
 * Fetch balance sheet (annual)
 */
export const fetchBalanceSheet = async (symbol: string): Promise<BalanceSheet[]> => {
  try {
    const response = await apiClient.get(`${FMP_BASE_URL}/balance-sheet-statement/${symbol.toUpperCase()}`, {
      params: {
        period: 'annual',
        limit: 5,
        apikey: FMP_API_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((item: any) => ({
      date: item.date,
      totalAssets: item.totalAssets || 0,
      totalLiabilities: item.totalLiabilities || 0,
      totalEquity: item.totalEquity || 0,
      cashAndCashEquivalents: item.cashAndCashEquivalents || 0,
      totalDebt: item.totalDebt || 0,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch balance sheet: ${error.message}`);
  }
};

/**
 * Fetch cash flow statement (annual)
 */
export const fetchCashFlow = async (symbol: string): Promise<CashFlow[]> => {
  try {
    const response = await apiClient.get(`${FMP_BASE_URL}/cash-flow-statement/${symbol.toUpperCase()}`, {
      params: {
        period: 'annual',
        limit: 5,
        apikey: FMP_API_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((item: any) => ({
      date: item.date,
      operatingCashFlow: item.operatingCashFlow || 0,
      capitalExpenditure: item.capitalExpenditure || 0,
      freeCashFlow: item.freeCashFlow || 0,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch cash flow: ${error.message}`);
  }
};

/**
 * Fetch key financial metrics
 */
export const fetchKeyMetrics = async (symbol: string): Promise<KeyMetrics | null> => {
  try {
    const response = await apiClient.get(`${FMP_BASE_URL}/key-metrics/${symbol.toUpperCase()}`, {
      params: {
        period: 'annual',
        limit: 1,
        apikey: FMP_API_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    const data = response.data[0];
    return {
      peRatio: data.peRatio || 0,
      priceToBook: data.priceToBookRatio || 0,
      debtToEquity: data.debtToEquity || 0,
      currentRatio: data.currentRatio || 0,
      returnOnEquity: data.roe || 0,
      returnOnAssets: data.roa || 0,
      profitMargin: data.netProfitMargin || 0,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch key metrics: ${error.message}`);
  }
};

