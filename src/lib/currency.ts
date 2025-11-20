import { Currency } from '@/store/settingsStore';

// Exchange rates (UZS to other currencies)
// Updated: 2024-11-20
// Source: cbu.uz (Central Bank of Uzbekistan)
const exchangeRates = {
  UZS: 1,
  USD: 12750, // 1 USD = 12,750 UZS (CBU rate)
  RUB: 127,   // 1 RUB = 127 UZS (CBU rate)
};

const currencySymbols = {
  UZS: 'so\'m',
  USD: '$',
  RUB: '₽',
};

// Cache for exchange rates
let ratesCache: { rates: typeof exchangeRates; timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour

/**
 * Fetch real-time exchange rates from CBU API
 * API: https://cbu.uz/uz/arkhiv-kursov-valyut/json/
 */
export async function fetchExchangeRates(): Promise<typeof exchangeRates> {
  try {
    // Check cache
    if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_DURATION) {
      return ratesCache.rates;
    }

    const response = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/');
    const data = await response.json();

    // Find USD and RUB rates
    const usdRate = data.find((item: any) => item.Ccy === 'USD');
    const rubRate = data.find((item: any) => item.Ccy === 'RUB');

    const newRates = {
      UZS: 1,
      USD: usdRate ? parseFloat(usdRate.Rate) : exchangeRates.USD,
      RUB: rubRate ? parseFloat(rubRate.Rate) : exchangeRates.RUB,
    };

    // Update cache
    ratesCache = {
      rates: newRates,
      timestamp: Date.now(),
    };

    return newRates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Return default rates on error
    return exchangeRates;
  }
}

/**
 * Format price with currency conversion
 */
export function formatPrice(priceInUZS: number, currency: Currency): string {
  const rates = ratesCache?.rates || exchangeRates;
  const convertedPrice = priceInUZS / rates[currency];
  const symbol = currencySymbols[currency];
  
  if (currency === 'UZS') {
    return `${convertedPrice.toLocaleString('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${symbol}`;
  }
  
  return `${symbol}${convertedPrice.toFixed(2)}`;
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency];
}

// Initialize rates on module load (client-side only)
if (typeof window !== 'undefined') {
  fetchExchangeRates().catch(console.error);
}
