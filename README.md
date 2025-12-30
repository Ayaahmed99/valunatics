# Valunetics Financial Dashboard

A comprehensive React + TypeScript financial consultancy dashboard with AI-powered features and real-time financial data integration, powered by Valunetics.

## 🚀 Features

### Core Features
- ✅ **AI Financial Advisor Chat** - Interactive chat with AI-powered financial guidance
- ✅ **Financial Health Assessment** - Comprehensive financial health evaluation
- ✅ **Investment Scenario Simulator** - Project investment outcomes with multiple risk scenarios

### Financial Data Features
- ✅ **Stock Price Chart** - Real-time stock price data with historical charts (Alpha Vantage API)
- ✅ **Company Financial Panel** - Complete financial statements and metrics (Financial Modeling Prep API)
- ✅ **Currency Converter** - Real-time currency conversion (exchangerate.host API)
- ✅ **Crypto Prices Dashboard** - Top 10 cryptocurrencies with market data (CoinGecko API)

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📦 Installation

1. **Clone the repository** (or navigate to project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the `project` directory
   - See `API_SETUP.md` for detailed instructions
   - Add your API keys:
     ```env
     VITE_ALPHA_VANTAGE_API_KEY=your_key_here
     VITE_FMP_API_KEY=your_key_here
     ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - Navigate to http://localhost:5173

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── FinancialHub.tsx          # Main navigation hub
│   │   ├── FinancialChat.tsx          # AI chat component
│   │   ├── FinancialAssessment.tsx    # Assessment component
│   │   ├── InvestmentScenarioSimulator.tsx  # Investment simulator
│   │   ├── StockPriceChart.tsx        # Stock price charts
│   │   ├── CompanyFinancialPanel.tsx  # Company financial data
│   │   ├── CurrencyConverter.tsx      # Currency converter
│   │   └── CryptoPricesDashboard.tsx  # Crypto dashboard
│   ├── services/
│   │   ├── api.ts                     # Axios configuration
│   │   ├── stockApi.ts                # Alpha Vantage API
│   │   ├── financialApi.ts            # Financial Modeling Prep API
│   │   ├── currencyApi.ts            # Exchange rate API
│   │   └── cryptoApi.ts               # CoinGecko API
│   ├── App.tsx                        # Main app component
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles
├── package.json
├── vite.config.ts
└── API_SETUP.md                       # API setup instructions
```

## 🔑 API Keys Required

### Required (for full functionality):
- **Alpha Vantage API** - For stock price data
  - Get free key: https://www.alphavantage.co/support/#api-key
  - Free tier: 5 calls/min, 500 calls/day

- **Financial Modeling Prep API** - For company financial data
  - Get free key: https://site.financialmodelingprep.com/developer/docs/
  - Free tier: 250 requests/day

### Optional (work without API keys):
- **Currency Converter** - Uses free public API (no key needed)
- **Crypto Dashboard** - Uses free public API (no key needed)

See `API_SETUP.md` for detailed setup instructions.

## 🎨 Features Overview

### Stock Price Chart
- Search any stock symbol (e.g., AAPL, MSFT, GOOGL)
- View historical price data with line charts
- See opening, closing, high, low prices
- Volume data and price trends

### Company Financial Panel
- Search by ticker symbol
- View company profile and key metrics
- Income statements, balance sheets, cash flow
- Financial ratios (P/E, ROE, debt-to-equity, etc.)

### Currency Converter
- Convert between 20+ currencies
- Real-time exchange rates
- Bidirectional conversion
- Quick conversion buttons

### Crypto Prices Dashboard
- Top 10 cryptocurrencies by market cap
- Real-time prices and 24h changes
- Market cap and volume data
- Auto-refresh capability

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking

## 📝 Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Functional Components** - Modern React patterns
- **Custom Hooks** - Reusable logic
- **Error Handling** - Comprehensive error states
- **Loading States** - User feedback
- **Responsive Design** - Mobile-friendly

## 🔒 Security Notes

- API keys are stored in `.env` file (not committed to git)
- All API calls use HTTPS
- No sensitive data stored in browser
- CORS handled by API providers

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a professional financial consultancy dashboard. Contributions and improvements are welcome!

## 📞 Support

For API-related issues, refer to:
- Alpha Vantage: https://www.alphavantage.co/documentation/
- Financial Modeling Prep: https://site.financialmodelingprep.com/developer/docs/
- CoinGecko: https://www.coingecko.com/en/api/documentation

---

**Note**: This dashboard provides financial information for educational purposes only. It does not constitute financial advice. Always consult with qualified financial advisors before making investment decisions.

