# API Setup Instructions

## Environment Variables

Create a `.env` file in the `project` directory with the following variables:

```env
# Alpha Vantage API Key
# Get your free API key from: https://www.alphavantage.co/support/#api-key
# Free tier: 5 API calls per minute, 500 calls per day
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here

# Financial Modeling Prep API Key
# Get your free API key from: https://site.financialmodelingprep.com/developer/docs/
# Free tier: 250 requests/day
VITE_FMP_API_KEY=your_fmp_api_key_here

# Supabase Configuration (if using Supabase features)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## API Keys Setup

### 1. Alpha Vantage API (Stock Price Chart)
- **Website**: https://www.alphavantage.co/
- **Free Tier**: 
  - 5 API calls per minute
  - 500 calls per day
- **How to get**: 
  1. Visit https://www.alphavantage.co/support/#api-key
  2. Fill out the form
  3. Copy your API key
  4. Add to `.env` as `VITE_ALPHA_VANTAGE_API_KEY`

### 2. Financial Modeling Prep API (Company Financial Panel)
- **Website**: https://site.financialmodelingprep.com/
- **Free Tier**: 
  - 250 requests per day
- **How to get**: 
  1. Visit https://site.financialmodelingprep.com/developer/docs/
  2. Sign up for a free account
  3. Get your API key from the dashboard
  4. Add to `.env` as `VITE_FMP_API_KEY`

### 3. Currency Converter API
- **API**: exchangerate.host
- **Status**: No API key required (free public API)
- **Rate Limit**: Reasonable use (no official limit)

### 4. CoinGecko API (Crypto Dashboard)
- **Website**: https://www.coingecko.com/en/api
- **Status**: No API key required for public endpoints
- **Rate Limit**: 10-50 calls/minute (varies by endpoint)

### 5. OpenAI API (AI-Powered Features)
- **Website**: https://platform.openai.com/
- **Required for**: 
  - Goal-Based Financial Planning
  - Smart Budget Planner
  - Automated Financial Reports
- **How to get**: 
  1. Visit https://platform.openai.com/api-keys
  2. Sign up or log in
  3. Create a new API key
  4. Add to `.env` as `VITE_OPENAI_API_KEY`
- **Note**: The app includes fallback mock implementations if API key is not provided

## Running the Project

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy the example above to `.env`
   - Add your API keys

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open http://localhost:5173 in your browser

## Features Overview

### ✅ Stock Price Chart
- **Component**: `StockPriceChart.tsx`
- **API**: Alpha Vantage
- **Features**: Historical price data, line charts, price trends
- **API Key Required**: Yes

### ✅ Company Financial Panel
- **Component**: `CompanyFinancialPanel.tsx`
- **API**: Financial Modeling Prep
- **Features**: Income statements, balance sheets, cash flow, key metrics
- **API Key Required**: Yes

### ✅ Currency Converter
- **Component**: `CurrencyConverter.tsx`
- **API**: exchangerate.host
- **Features**: Real-time exchange rates, bidirectional conversion
- **API Key Required**: No

### ✅ Crypto Prices Dashboard
- **Component**: `CryptoPricesDashboard.tsx`
- **API**: CoinGecko
- **Features**: Top 10 cryptocurrencies, market data, auto-refresh
- **API Key Required**: No

## Troubleshooting

### API Rate Limits
- **Alpha Vantage**: If you hit the rate limit, wait 1 minute between requests
- **Financial Modeling Prep**: Monitor your daily usage (250 requests/day)

### CORS Issues
- All APIs used support CORS for browser requests
- If you encounter CORS errors, check your network tab

### Missing Data
- Some companies may not have complete financial data
- Try different ticker symbols if data is missing

## Notes

- The application uses mock/demo data if API keys are not provided
- Some features may have limited functionality without API keys
- Always check API documentation for the latest rate limits and changes

