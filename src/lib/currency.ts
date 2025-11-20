import { Currency } from '@/store/settingsStore';

const exchangeRates = {
  UZS: 1,
  USD: 12500, // 1 USD = 12500 UZS
  RUB: 130,   // 1 RUB = 130 UZS
};

const currencySymbols = {
  UZS: 'so\'m',
  USD: '$',
  RUB: '₽',
};

export function formatPrice(priceInUZS: number, currency: Currency): string {
  const convertedPrice = priceInUZS / exchangeRates[currency];
  const symbol = currencySymbols[currency];
  
  if (currency === 'UZS') {
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  }
  
  return `${symbol}${convertedPrice.toFixed(2)}`;
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency];
}
