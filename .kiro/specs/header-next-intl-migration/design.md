# Design Document: Header next-intl Migration

## Overview

This design outlines the migration of the Header.tsx component from using custom translation logic to next-intl. The migration will replace the current manual language switching and custom translations object with next-intl's standardized internationalization features while maintaining all existing functionality.

## Architecture

### Current Architecture

- **Custom Translation System**: Uses `translations` object from `@/lib/translations`
- **Manual Language Switching**: Hardcoded language conditions for settings tooltip
- **Settings Store Integration**: Uses `useSettingsStore` for language and currency management
- **Mixed Translation Approach**: Some text uses translation keys, others use hardcoded conditions

### Target Architecture

- **next-intl Integration**: Uses `useTranslations` hook for all text content
- **Centralized Message Management**: All translations stored in JSON message files
- **Consistent Translation Keys**: Uniform approach to accessing translations
- **Namespace Organization**: Header translations organized under dedicated namespace

## Components and Interfaces

### Translation Hook Integration

```typescript
// Replace current approach
const { language, currency } = useSettingsStore();
const t = translations[language];

// With next-intl approach
const t = useTranslations("Header");
const { currency } = useSettingsStore(); // Keep currency for formatting
```

### Message Structure

The header translations will be organized under a `Header` namespace in the message files:

```json
{
  "Header": {
    "marketplace": "Marketplace",
    "cart": "Cart",
    "inventory": "Inventory",
    "login": "Login",
    "logout": "Logout",
    "settingsTooltip": "Settings"
  }
}
```

### Component Dependencies

- **Remove**: `@/lib/translations` import
- **Remove**: `useSettingsStore` for language management (keep for currency)
- **Add**: `useTranslations` from `next-intl`
- **Maintain**: All existing store dependencies (auth, cart, settings for currency)

## Data Models

### Translation Key Mapping

Current hardcoded patterns will be replaced with translation keys:

| Current Pattern                                                                   | Translation Key        |
| --------------------------------------------------------------------------------- | ---------------------- |
| `t.marketplace`                                                                   | `t('marketplace')`     |
| `t.cart`                                                                          | `t('cart')`            |
| `t.inventory`                                                                     | `t('inventory')`       |
| `t.login`                                                                         | `t('login')`           |
| `t.logout`                                                                        | `t('logout')`          |
| `language === "uz" ? "Sozlamalar" : language === "ru" ? "Настройки" : "Settings"` | `t('settingsTooltip')` |

### Message File Updates

Each language file (uz.json, en.json, ru.json) will receive a new `Header` section containing all header-specific translations.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._
Now I'll analyze the acceptance criteria to determine which ones are testable as properties:

Based on the prework analysis, I'll perform property reflection to eliminate redundancy:

**Property Reflection:**

- Properties 1.1 and 1.2 can be combined into one comprehensive property about translation hook usage
- Properties 4.1, 4.2, and 4.4 can be combined into one property about consistent translation key usage
- Properties 6.1, 6.2, and 6.3 can be combined into one property about translation consistency
- Properties 7.1, 7.2, 7.3, 7.4, and 7.5 can be combined into comprehensive store integration properties
- Properties 8.1, 8.2, 8.3, and 8.4 can be combined into one property about settings modal functionality

Here are the testable correctness properties after reflection:

### Property 1: Translation Hook Integration

_For any_ header render, the component should use next-intl's useTranslations hook and all text elements should access translations through this hook
**Validates: Requirements 1.1, 1.2**

### Property 2: Message File Structure Consistency

_For any_ translation key that exists in one language file, the same key should exist in all other language files (uz.json, en.json, ru.json) under the Header namespace
**Validates: Requirements 2.4**

### Property 3: Translation Coverage Completeness

_For any_ text element in the header, there should exist a corresponding translation key in the message files
**Validates: Requirements 2.1**

### Property 4: Navigation Elements Preservation

_For any_ header render, all expected navigation elements (marketplace, cart, inventory, login/logout) should be present in the DOM
**Validates: Requirements 3.1**

### Property 5: Authentication State Rendering

_For any_ authentication state (logged in/logged out), the header should display the appropriate elements (user menu vs login button)
**Validates: Requirements 3.2**

### Property 6: Cart Badge Display

_For any_ cart state with items, the cart badge should display the correct item count
**Validates: Requirements 3.3**

### Property 7: Click Handler Preservation

_For any_ clickable header element, clicking it should trigger the expected navigation or action
**Validates: Requirements 3.4**

### Property 8: Settings Modal Integration

_For any_ settings button interaction, the modal should open/close correctly and maintain proper state management with appropriate tooltip text
**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 9: Translation Key Consistency

_For any_ text element in the header, it should use translation keys consistently rather than hardcoded language conditions
**Validates: Requirements 4.1, 4.2, 4.4, 6.1, 6.2, 6.3**

### Property 10: Auth Store Integration

_For any_ authentication state change, the header should reflect the change using the existing auth store logic
**Validates: Requirements 7.1**

### Property 11: Cart Store Integration

_For any_ cart state change, the header should reflect the change using the existing cart store logic
**Validates: Requirements 7.2**

### Property 12: State Management Preservation

_For any_ component lifecycle, all existing useEffect hooks and state management should continue to function correctly
**Validates: Requirements 7.3**

### Property 13: Currency Display Functionality

_For any_ user balance and currency setting, the header should display the correctly converted balance using settings store integration
**Validates: Requirements 7.4, 7.5**

## Error Handling

### Translation Key Fallbacks

- If a translation key is missing, next-intl will display the key name as fallback
- Component should gracefully handle missing translations without breaking
- Development environment should warn about missing translation keys

### Locale Handling

- Component should work with all supported locales (uz, en, ru)
- Invalid or missing locale should fall back to default locale (uz)
- Locale changes should not cause component re-mounting issues

### Store State Errors

- Auth store errors should not prevent header rendering
- Cart count errors should default to 0
- Currency conversion errors should fall back to original balance
- Settings modal errors should not break the header functionality

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific scenarios and property-based tests for comprehensive coverage:

**Unit Tests:**

- Test specific translation key mappings
- Test authentication state transitions
- Test settings modal open/close behavior
- Test cart badge display with specific counts
- Test error conditions and fallbacks
- Test TypeScript compilation and type safety

**Property-Based Tests:**

- Test translation coverage across all supported locales
- Test header rendering with random auth/cart states
- Test click handlers with various component states
- Test store integration with random state changes
- Test settings modal functionality with various states

**Testing Configuration:**

- Use React Testing Library for component testing
- Use Jest for unit tests and property-based testing with fast-check
- Minimum 100 iterations per property test
- Each property test tagged with: **Feature: header-next-intl-migration, Property {number}: {property_text}**

**Integration Testing:**

- Test header within full application context
- Test locale switching through next-intl routing
- Test store state persistence across navigation
- Test server-side rendering compatibility
