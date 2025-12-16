export type Currency = 'USD' | 'UZS' | 'RUB';

interface ExchangeRates {
  USD: number;
  UZS: number;
  RUB: number;
}

let cachedRates: ExchangeRates | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Fetch from CBU.uz API with CORS proxy or use fallback
    const response = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Find USD and RUB rates
    const usdRate = data.find((item: any) => item.Ccy === 'USD');
    const rubRate = data.find((item: any) => item.Ccy === 'RUB');
    
    const rates: ExchangeRates = {
      USD: 1, // Base currency
      UZS: parseFloat(usdRate?.Rate?.replace(',', '.') || '12500'), // Handle comma decimal separator
      RUB: parseFloat(rubRate?.Rate?.replace(',', '.') || '130') // Handle comma decimal separator
    };
    
    cachedRates = rates;
    lastFetch = now;
    
    return rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates from CBU.uz, using fallback rates:', error);
    
    // Return fallback rates
    const fallbackRates = {
      USD: 1,
      UZS: 12500, // Approximate rate
      RUB: 130    // Approximate rate
    };
    
    cachedRates = fallbackRates;
    lastFetch = now;
    
    return fallbackRates;
  }
}

export async function convertCurrency(
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;
  
  const rates = await getExchangeRates();
  
  // Convert to USD first, then to target currency
  let usdAmount = amount;
  if (fromCurrency !== 'USD') {
    usdAmount = amount / rates[fromCurrency];
  }
  
  if (toCurrency === 'USD') {
    return usdAmount;
  }
  
  return usdAmount * rates[toCurrency];
}

export function formatPrice(amount: number | string | null | undefined, currency: Currency): string {
  // Convert to number and handle invalid values
  const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  const safeAmount = isNaN(numAmount) ? 0 : numAmount;
  
  // Format number with space as thousand separator
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  switch (currency) {
    case 'USD':
      return `$${formatNumber(safeAmount, 2)}`;
    case 'UZS':
      return `${formatNumber(safeAmount, 0)} so'm`;
    case 'RUB':
      return `${formatNumber(safeAmount, 2)} ₽`;
    default:
      return `$${formatNumber(safeAmount, 2)}`;
  }
}

export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'USD': return '$';
    case 'UZS': return 'so\'m';
    case 'RUB': return '₽';
    default: return '$';
  }
}