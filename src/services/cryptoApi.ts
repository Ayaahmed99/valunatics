/**
 * CoinGecko API Service
 * Fetches cryptocurrency market data
 * 
 * API: https://www.coingecko.com/en/api
 * Free tier: No API key required for public endpoints
 * Rate limit: 10-50 calls/minute (varies by endpoint)
 */
import apiClient from './api';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

/**
 * Fetch top cryptocurrencies by market cap
 * @param limit - Number of cryptocurrencies to fetch (default: 10)
 */
export const fetchTopCryptocurrencies = async (limit: number = 10): Promise<Cryptocurrency[]> => {
  try {
    const response = await apiClient.get(`${COINGECKO_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format from API');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch cryptocurrency data: ${error.message}`);
  }
};

/**
 * Fetch specific cryptocurrency by ID
 * @param id - Cryptocurrency ID (e.g., 'bitcoin', 'ethereum')
 */
export const fetchCryptocurrency = async (id: string): Promise<Cryptocurrency | null> => {
  try {
    const response = await apiClient.get(`${COINGECKO_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: id,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });

    if (!Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }

    return response.data[0];
  } catch (error: any) {
    throw new Error(`Failed to fetch cryptocurrency: ${error.message}`);
  }
};

