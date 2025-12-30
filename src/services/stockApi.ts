/**
 * Alpha Vantage API Service
 * Fetches stock price data and company information
 * 
 * API Key: Get free API key from https://www.alphavantage.co/support/#api-key
 * Free tier: 5 API calls per minute, 500 calls per day
 */
import apiClient from './api';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export interface StockTimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

/**
 * Fetch daily time series data for a stock symbol
 * @param symbol - Stock ticker symbol (e.g., 'AAPL', 'MSFT')
 * @param outputsize - 'compact' (last 100 data points) or 'full' (full-length time series)
 */
export const fetchStockTimeSeries = async (
  symbol: string,
  outputsize: 'compact' | 'full' = 'compact'
): Promise<StockTimeSeriesData[]> => {
  try {
    const response = await apiClient.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        outputsize,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const data = response.data;

    // Check for API errors
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    // Extract time series data
    const timeSeriesKey = 'Time Series (Daily)';
    if (!data[timeSeriesKey]) {
      throw new Error('Invalid response format from API');
    }

    const timeSeries = data[timeSeriesKey];
    const formattedData: StockTimeSeriesData[] = Object.keys(timeSeries)
      .map((date) => ({
        date,
        open: parseFloat(timeSeries[date]['1. open']),
        high: parseFloat(timeSeries[date]['2. high']),
        low: parseFloat(timeSeries[date]['3. low']),
        close: parseFloat(timeSeries[date]['4. close']),
        volume: parseInt(timeSeries[date]['5. volume']),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return formattedData;
  } catch (error: any) {
    throw new Error(`Failed to fetch stock data: ${error.message}`);
  }
};

/**
 * Fetch real-time stock quote
 * @param symbol - Stock ticker symbol
 */
export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await apiClient.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const data = response.data;

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('Invalid response format from API');
    }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch stock quote: ${error.message}`);
  }
};

