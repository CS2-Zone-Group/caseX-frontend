# Design Document

## Overview

This design outlines the migration of the home page component (`src/app/[locale]/page.tsx`) from using custom translation logic to next-intl. The migration will replace manual language management with next-intl's `useTranslations` hook and update the messages JSON files with comprehensive translations for all page content.

## Architecture

### Current Architecture

- Custom translation object imported from `@/lib/translations`
- Manual language state management via `useSettingsStore`
- Inline conditional rendering for different languages
- Manual language switching buttons in the UI

### Target Architecture

- next-intl's `useTranslations` hook for accessing translations
- Structured message keys in JSON files
- Automatic locale handling through next-intl routing
- Removal of manual language switching UI

## Components and Interfaces

### Page Component Structure

```typescript
// Current structure (to be replaced)
const { language, setLanguage } = useSettingsStore();
const t = translations[language];

// Target structure
const t = useTranslations("HomePage");
```

### Translation Key Structure

The messages will be organized into logical sections:

```typescript
interface PageTranslations {
  meta: {
    title: string;
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    marketplaceButton: string;
    signUpButton: string;
  };
  stats: {
    skins: string;
    users: string;
    support: string;
    secure: string;
  };
  features: {
    title: string;
    bestPrices: {
      title: string;
      description: string;
    };
    securePayments: {
      title: string;
      description: string;
    };
    fastDelivery: {
      title: string;
      description: string;
    };
  };
  about: {
    title: string;
    description: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
}
```

## Data Models

### Messages JSON Structure

Each language file (uz.json, en.json, ru.json) will contain:

```json
{
  "HomePage": {
    "meta": {
      "title": "CaseX - CS2 Skinlari Marketplace"
    },
    "hero": {
      "badge": "O'zbekiston #1 CS2 Marketplace",
      "title": "CS2 Skinlarini Xarid Qiling",
      "description": "Eng yaxshi narxlarda, xavfsiz va tez. O'zbekistondagi eng ishonchli CS2 skinlari marketplace.",
      "marketplaceButton": "🛍️ Marketplace'ga O'tish",
      "signUpButton": "Ro'yxatdan O'tish"
    },
    "stats": {
      "skins": "Skinlar",
      "users": "Foydalanuvchilar",
      "support": "Qo'llab-quvvatlash",
      "secure": "Xavfsiz"
    },
    "features": {
      "title": "NIMA UCHUN CASEX?",
      "bestPrices": {
        "title": "Eng Yaxshi Narxlar",
        "description": "Bozordagi eng arzon narxlarda CS2 skinlarini sotib oling"
      },
      "securePayments": {
        "title": "Xavfsiz To'lovlar",
        "description": "Click, Payme va boshqa mahalliy to'lov tizimlari orqali xavfsiz to'lang"
      },
      "fastDelivery": {
        "title": "Tezkor Yetkazib Berish",
        "description": "Skinlaringizni bir necha daqiqada qo'lingizga oling"
      }
    },
    "about": {
      "title": "CaseX Haqida",
      "description": "CaseX - O'zbekistondagi birinchi va eng ishonchli CS2 skinlari marketplace. Biz o'yinchilarga xavfsiz, tez va qulay tarzda skinlar sotib olish va sotish imkoniyatini taqdim etamiz."
    },
    "footer": {
      "description": "CS2 skinlari uchun O'zbekiston marketplace",
      "copyright": "Barcha huquqlar himoyalangan."
    }
  }
}
```

## Implementation Strategy

### Phase 1: Update Messages Files

1. Analyze all text content in the current page component
2. Create structured translation keys for each section
3. Update all three language files (uz.json, en.json, ru.json) with comprehensive translations
4. Ensure consistent key structure across all languages

### Phase 2: Migrate Component Logic

1. Remove custom translation imports
2. Replace `useSettingsStore` language management with `useTranslations` hook
3. Update all text rendering to use translation keys
4. Remove manual language switching buttons
5. Update document title management to use translations

### Phase 3: Clean Up

1. Remove unused imports and dependencies
2. Verify all functionality works correctly
3. Ensure proper TypeScript typing

## Error Handling

### Translation Key Errors

- If a translation key is missing, next-intl will display the key name as fallback
- Development mode will show warnings for missing keys
- Production will gracefully handle missing translations

### Locale Validation

- The layout already handles locale validation and fallbacks
- Invalid locales will fall back to the default locale (uz)

## Testing Strategy

### Manual Testing

- Verify all text content displays correctly in all three languages
- Test navigation and routing functionality
- Confirm document title updates properly
- Validate that no manual language switching UI remains

### Integration Testing

- Test that next-intl integration works seamlessly with existing layout
- Verify that all translation keys resolve correctly
- Confirm that the page renders without errors in all locales

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Translation Key Coverage

_For any_ visible text content in the page component, there should be a corresponding translation key that is used instead of hardcoded strings
**Validates: Requirements 1.2, 2.1**

### Property 2: Message Structure Consistency

_For any_ translation key that exists in one language file, the same key structure should exist in all other language files (uz.json, en.json, ru.json)
**Validates: Requirements 2.8**

### Property 3: Content Section Preservation

_For any_ content section that existed in the original page, the same section should be present and functional after migration
**Validates: Requirements 3.1**

### Property 4: Navigation Link Preservation

_For any_ navigation link that existed in the original page, the same link should be present and functional after migration
**Validates: Requirements 3.2**

### Property 5: Interactive Element Preservation

_For any_ interactive element that existed in the original page, the same element should be present and functional after migration
**Validates: Requirements 3.5**

### Property 6: Document Title Translation

_For any_ locale, when the page loads, the document title should be set using the translation key for that locale
**Validates: Requirements 6.1, 6.2**
