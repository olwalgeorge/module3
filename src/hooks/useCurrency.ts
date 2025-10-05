
import { useState, useEffect } from 'react';
import { currencies, currencySettings } from '../mocks/currencies';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  position: 'before' | 'after';
  decimals: number;
  isBase: boolean;
  exchangeRate: number;
  lastUpdated: string;
}

export const useCurrency = () => {
  const [baseCurrency, setBaseCurrency] = useState(currencySettings.baseCurrency);
  const [displayCurrency, setDisplayCurrency] = useState(currencySettings.displayCurrency);
  const [availableCurrencies] = useState<Currency[]>(currencies);

  const getCurrency = (code: string): Currency | undefined => {
    return availableCurrencies.find(currency => currency.code === code);
  };

  const formatCurrency = (
    amount: number, 
    currencyCode: string = displayCurrency,
    options: {
      showSymbol?: boolean;
      showCode?: boolean;
      decimals?: number;
    } = {}
  ): string => {
    const currency = getCurrency(currencyCode);
    if (!currency) return amount.toString();

    const {
      showSymbol = currencySettings.showCurrencySymbol,
      showCode = currencySettings.showCurrencyCode,
      decimals = currency.decimals
    } = options;

    const formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    let result = '';
    
    if (currency.position === 'before') {
      if (showSymbol) result += currency.symbol;
      if (showCode && showSymbol) result += ' ';
      if (showCode && !showSymbol) result += currency.code + ' ';
      result += formattedAmount;
    } else {
      result += formattedAmount;
      if (showSymbol) result += ' ' + currency.symbol;
      if (showCode && !showSymbol) result += ' ' + currency.code;
    }

    return result;
  };

  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    const fromCurr = getCurrency(fromCurrency);
    const toCurr = getCurrency(toCurrency);
    
    if (!fromCurr || !toCurr) return amount;
    if (fromCurrency === toCurrency) return amount;

    // Convert to base currency first, then to target currency
    const baseAmount = fromCurr.isBase ? amount : amount / fromCurr.exchangeRate;
    const convertedAmount = toCurr.isBase ? baseAmount : baseAmount * toCurr.exchangeRate;

    return convertedAmount;
  };

  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1;
    
    const fromCurr = getCurrency(fromCurrency);
    const toCurr = getCurrency(toCurrency);
    
    if (!fromCurr || !toCurr) return 1;

    if (fromCurr.isBase) {
      return toCurr.exchangeRate;
    } else if (toCurr.isBase) {
      return 1 / fromCurr.exchangeRate;
    } else {
      return toCurr.exchangeRate / fromCurr.exchangeRate;
    }
  };

  const updateDisplayCurrency = (currencyCode: string) => {
    setDisplayCurrency(currencyCode);
    // In a real app, this would save to localStorage or API
  };

  const updateBaseCurrency = (currencyCode: string) => {
    setBaseCurrency(currencyCode);
    // In a real app, this would update all prices and exchange rates
  };

  return {
    baseCurrency,
    displayCurrency,
    availableCurrencies,
    getCurrency,
    formatCurrency,
    convertCurrency,
    getExchangeRate,
    updateDisplayCurrency,
    updateBaseCurrency
  };
};
