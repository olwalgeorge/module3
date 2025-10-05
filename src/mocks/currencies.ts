
export const currencies = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    position: 'before',
    decimals: 2,
    isBase: true,
    exchangeRate: 1.0000,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 0.9234,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 0.7856,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    position: 'before',
    decimals: 0,
    isBase: false,
    exchangeRate: 149.2500,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 1.3456,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 1.4789,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    position: 'after',
    decimals: 2,
    isBase: false,
    exchangeRate: 0.8567,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 7.2345,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 83.1234,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    position: 'before',
    decimals: 0,
    isBase: false,
    exchangeRate: 1324.56,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 1.3421,
    lastUpdated: '2024-01-16T10:00:00Z'
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    position: 'before',
    decimals: 2,
    isBase: false,
    exchangeRate: 17.0234,
    lastUpdated: '2024-01-16T10:00:00Z'
  }
];

export const exchangeRateHistory = [
  {
    id: 1,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.9234,
    date: '2024-01-16',
    source: 'ECB'
  },
  {
    id: 2,
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    rate: 0.7856,
    date: '2024-01-16',
    source: 'Bank of England'
  },
  {
    id: 3,
    fromCurrency: 'USD',
    toCurrency: 'JPY',
    rate: 149.2500,
    date: '2024-01-16',
    source: 'Bank of Japan'
  },
  {
    id: 4,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.9189,
    date: '2024-01-15',
    source: 'ECB'
  },
  {
    id: 5,
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    rate: 0.7823,
    date: '2024-01-15',
    source: 'Bank of England'
  }
];

export const currencySettings = {
  baseCurrency: 'USD',
  displayCurrency: 'USD',
  autoUpdateRates: true,
  updateFrequency: 'hourly', // hourly, daily, weekly
  rateSource: 'ECB', // ECB, Fed, Bank of England, etc.
  roundingMethod: 'round', // round, floor, ceil
  showCurrencyCode: true,
  showCurrencySymbol: true,
  decimalSeparator: '.',
  thousandsSeparator: ',',
  lastRateUpdate: '2024-01-16T10:00:00Z'
};
