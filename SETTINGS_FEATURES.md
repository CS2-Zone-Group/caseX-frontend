# CaseX - Settings Features

## ✅ Qo'shilgan Funksiyalar

### 1. Dark/Light Mode
- ✅ Light mode (Yorug' mavzu)
- ✅ Dark mode (Qorong'i mavzu)
- ✅ System mode (Tizim sozlamasiga qarab)
- ✅ Tailwind CSS dark mode support
- ✅ Persistent storage (localStorage)
- ✅ Real-time theme switching

### 2. Multi-Language Support
- ✅ O'zbek tili (uz)
- ✅ Русский язык (ru)
- ✅ English (en)
- ✅ Translation system
- ✅ All UI elements translated
- ✅ Persistent language selection

**Translated Elements:**
- Navigation (Marketplace, Inventory, Cart)
- Authentication (Login, Register, Logout)
- Marketplace (Search, Filters, Sort)
- Cart (Items, Total, Checkout)
- Inventory (List for sale, Unlist)
- Common (Loading, Buttons, etc.)

### 3. Multi-Currency Support
- ✅ UZS (O'zbek so'mi) - Base currency
- ✅ USD (US Dollar)
- ✅ RUB (Russian Ruble)
- ✅ Real-time currency conversion
- ✅ Exchange rates:
  - 1 USD = 12,500 UZS
  - 1 RUB = 130 UZS
- ✅ Formatted price display

### 4. Settings Modal
- ✅ Accessible from Header (gear icon)
- ✅ Theme selector (3 options)
- ✅ Language selector (3 options)
- ✅ Currency selector (3 options)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Click outside to close

## 🎨 UI/UX Features

### Theme Switching
```
Light Mode:
- White background
- Dark text
- Light borders

Dark Mode:
- Dark gray background
- Light text
- Dark borders

System Mode:
- Follows OS preference
- Auto-switches with system
```

### Language Examples
```
O'zbek:
- Marketplace
- Inventorim
- Savat
- Kirish

Русский:
- Маркетплейс
- Мой инвентарь
- Корзина
- Войти

English:
- Marketplace
- My Inventory
- Cart
- Login
```

### Currency Display
```
UZS: 1,500.00 so'm
USD: $0.12
RUB: ₽11.54
```

## 📁 File Structure

```
src/
├── store/
│   └── settingsStore.ts       # Zustand store for settings
├── lib/
│   ├── translations.ts        # Translation strings
│   └── currency.ts            # Currency conversion
├── components/
│   ├── Header.tsx             # Updated with settings
│   └── SettingsModal.tsx      # Settings modal component
└── app/
    └── layout.tsx             # Initialize settings
```

## 🔧 Technical Implementation

### Settings Store (Zustand)
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'uz' | 'ru' | 'en';
  currency: 'UZS' | 'USD' | 'RUB';
  setTheme: (theme) => void;
  setLanguage: (language) => void;
  setCurrency: (currency) => void;
}
```

### Translation System
```typescript
const t = translations[language];
<button>{t.login}</button>
```

### Currency Formatter
```typescript
formatPrice(1500, 'USD') // "$0.12"
formatPrice(1500, 'UZS') // "1500.00 so'm"
```

### Theme Application
```typescript
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}
```

## 🧪 Test Qilish

### 1. Theme Switching
1. Header'da settings icon'ni bosing
2. Light/Dark/System tanlang
3. UI ranglar o'zgarishini kuzating
4. Refresh qiling - sozlama saqlanganligini tekshiring

### 2. Language Switching
1. Settings modal'ni oching
2. O'zbek/Русский/English tanlang
3. Barcha matnlar o'zgarishini kuzating
4. Har bir sahifani tekshiring

### 3. Currency Switching
1. Settings'da currency tanlang
2. Header'dagi balance o'zgarishini kuzating
3. Marketplace'da narxlar o'zgarishini kuzating
4. Cart'da total price o'zgarishini kuzating

## 📝 Notes

- Settings localStorage'da saqlanadi
- Theme system preference'ni kuzatadi
- Currency conversion real-time
- All translations in one file
- Easy to add new languages
- Easy to update exchange rates

## 🔄 Keyingi Qadamlar

- [ ] More languages (Turkish, Arabic)
- [ ] More currencies (EUR, GBP)
- [ ] Real-time exchange rates API
- [ ] Font size settings
- [ ] Accessibility settings
- [ ] Notification preferences
- [ ] Sound effects toggle
