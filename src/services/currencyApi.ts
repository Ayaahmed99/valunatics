/**
 * Exchange Rate API Service
 * Fetches real-time currency exchange rates
 * 
 * Using exchangerate.host API (free, no API key required)
 * Alternative: Open Exchange Rates (requires API key)
 */
import apiClient from './api';

const EXCHANGE_RATE_BASE_URL = 'https://api.exchangerate.host';

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  date: string;
}

export interface CurrencyList {
  [key: string]: string;
}

/**
 * Fetch exchange rate between two currencies
 * @param from - Source currency code (e.g., 'USD')
 * @param to - Target currency code (e.g., 'EUR')
 */
export const fetchExchangeRate = async (from: string, to: string): Promise<ExchangeRate> => {
  try {
    const response = await apiClient.get(`${EXCHANGE_RATE_BASE_URL}/convert`, {
      params: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error('Failed to fetch exchange rate');
    }

    return {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate: data.result,
      date: data.date || new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch exchange rate: ${error.message}`);
  }
};

/**
 * Fetch latest exchange rates for a base currency
 * @param base - Base currency code (default: 'USD')
 */
export const fetchLatestRates = async (base: string = 'USD'): Promise<{ [key: string]: number }> => {
  try {
    const response = await apiClient.get(`${EXCHANGE_RATE_BASE_URL}/latest`, {
      params: {
        base: base.toUpperCase(),
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error('Failed to fetch latest rates');
    }

    return data.rates || {};
  } catch (error: any) {
    throw new Error(`Failed to fetch latest rates: ${error.message}`);
  }
};

/**
 * Get list of supported currencies
 */
export const getSupportedCurrencies = (): CurrencyList => {
  return {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    INR: 'Indian Rupee',
    NZD: 'New Zealand Dollar',
    SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar',
    SEK: 'Swedish Krona',
    NOK: 'Norwegian Krone',
    DKK: 'Danish Krone',
    PLN: 'Polish Zloty',
    MXN: 'Mexican Peso',
    BRL: 'Brazilian Real',
    ZAR: 'South African Rand',
    KRW: 'South Korean Won',
    TRY: 'Turkish Lira',
    RUB: 'Russian Ruble',
  };
};

