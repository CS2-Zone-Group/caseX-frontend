# CaseX - Real-time Currency Exchange Rates

## ✅ Implemented Features

### 1. CBU API Integration
- **Source:** Central Bank of Uzbekistan (cbu.uz)
- **API:** https://cbu.uz/uz/arkhiv-kursov-valyut/json/
- **Update Frequency:** Real-time (cached for 1 hour)
- **Currencies:** USD, RUB, UZS

### 2. Exchange Rate Caching
- Cache duration: 1 hour
- Automatic refresh
- Fallback to default rates on error

### 3. Price Formatting
- UZS: `15,000 so'm` (no decimals)
- USD: `$1.18`
- RUB: `₽118.11`

## 📊 API Details

### CBU API Response
```json
[
  {
    "id": 1,
    "Code": "840",
    "Ccy": "USD",
    "CcyNm_RU": "Доллар США",
    "CcyNm_UZ": "AQSH dollari",
    "CcyNm_UZC": "АҚШ доллари",
    "CcyNm_EN": "US Dollar",
    "Nominal": "1",
    "Rate": "12750.00",
    "Diff": "0.00",
    "Date": "20.11.2024"
  },
  {
    "id": 2,
    "Code": "643",
    "Ccy": "RUB",
    "CcyNm_RU": "Российский рубль",
    "CcyNm_UZ": "Rossiya rubli",
    "CcyNm_UZC": "Россия рубли",
    "CcyNm_EN": "Russian Ruble",
    "Nominal": "1",
    "Rate": "127.00",
    "Diff": "0.00",
    "Date": "20.11.2024"
  }
]
```

### Implementation
```typescript
export async function fetchExchangeRates() {
  try {
    const response = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/');
    const data = await response.json();

    const usdRate = data.find((item: any) => item.Ccy === 'USD');
    const rubRate = data.find((item: any) => item.Ccy === 'RUB');

    return {
      UZS: 1,
      USD: parseFloat(usdRate.Rate),
      RUB: parseFloat(rubRate.Rate),
    };
  } catch (error) {
    // Fallback to default rates
    return exchangeRates;
  }
}
```

## 🔧 Usage

### Format Price
```typescript
import { formatPrice } from '@/lib/currency';

// UZS
formatPrice(15000, 'UZS') // "15,000 so'm"

// USD
formatPrice(15000, 'USD') // "$1.18"

// RUB
formatPrice(15000, 'RUB') // "₽118.11"
```

### Fetch Latest Rates
```typescript
import { fetchExchangeRates } from '@/lib/currency';

const rates = await fetchExchangeRates();
console.log(rates);
// { UZS: 1, USD: 12750, RUB: 127 }
```

## 📝 Current Rates (2024-11-20)

| Currency | Rate (to 1 UZS) | Symbol |
|----------|-----------------|--------|
| UZS      | 1               | so'm   |
| USD      | 12,750          | $      |
| RUB      | 127             | ₽      |

**Example Conversions:**
- 15,000 UZS = $1.18 USD
- 15,000 UZS = ₽118.11 RUB
- 250,000 UZS = $19.61 USD
- 250,000 UZS = ₽1,968.50 RUB

## 🧪 Testing

### 1. Check Exchange Rates
```typescript
// In browser console
import { fetchExchangeRates } from '@/lib/currency';
const rates = await fetchExchangeRates();
console.log(rates);
```

### 2. Test Price Formatting
```typescript
import { formatPrice } from '@/lib/currency';

console.log(formatPrice(15000, 'UZS')); // "15,000 so'm"
console.log(formatPrice(15000, 'USD')); // "$1.18"
console.log(formatPrice(15000, 'RUB')); // "₽118.11"
```

### 3. Test Currency Switching
1. Open Settings modal
2. Switch between UZS/USD/RUB
3. Check prices in marketplace
4. Check balance in header
5. Check cart total

## 🔄 Cache Behavior

### Cache Duration
- **Duration:** 1 hour (3,600,000 ms)
- **Storage:** In-memory (not persistent)
- **Refresh:** Automatic on cache expiry

### Cache Logic
```typescript
let ratesCache: { rates: ExchangeRates; timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour

if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_DURATION) {
  return ratesCache.rates; // Use cached rates
}

// Fetch new rates and update cache
```

## 🌐 Alternative APIs

If CBU API is down, you can use these alternatives:

### 1. ExchangeRate-API
```typescript
// Free tier: 1,500 requests/month
const response = await fetch('https://api.exchangerate-api.com/v4/latest/UZS');
```

### 2. Fixer.io
```typescript
// Requires API key
const response = await fetch('https://api.fixer.io/latest?base=UZS&symbols=USD,RUB');
```

### 3. CurrencyAPI
```typescript
// Requires API key
const response = await fetch('https://api.currencyapi.com/v3/latest?base_currency=UZS');
```

## 📊 Inventory Test Data

### Add Test Inventory
```bash
cd caseX-backend
npm run add-inventory
```

This will add 3 skins to test user's inventory:
- AK-47 | Redline (15,000 so'm)
- AWP | Dragon Lore (250,000 so'm)
- M4A4 | Howl (180,000 so'm)

### Check Inventory
1. Login with: test@casex.uz / test123
2. Go to: http://localhost:3000/inventory
3. You should see 3 skins with images

## 🔧 Troubleshooting

### Issue: Rates not updating
**Solution:** Clear cache and refresh
```typescript
// In browser console
localStorage.clear();
location.reload();
```

### Issue: API request failed
**Solution:** Check network and fallback rates
- Default USD rate: 12,750 UZS
- Default RUB rate: 127 UZS

### Issue: Inventory images not showing
**Solution:** Run add-inventory script
```bash
cd caseX-backend
npm run add-inventory
```

## 📝 Notes

- Exchange rates update every hour
- Rates are fetched from CBU (official source)
- Fallback rates used on API failure
- UZS prices stored in database
- Conversion happens on frontend
- Cache is in-memory (resets on page reload)
