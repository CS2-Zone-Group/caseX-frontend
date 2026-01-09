# Design Document: Navbar next-intl Migration

## Overview

This design outlines the migration of the Navbar.tsx component from using custom translation logic to next-intl. The migration will replace the current manual language switching and custom translations object with next-intl's standardized internationalization features while maintaining all existing functionality.

## Architecture

### Current Architecture

- **Custom Translation System**: Uses `translations` object from `@/lib/translations`
- **Manual Language Switching**: Hardcoded language conditions throughout the component
- **Settings Store Integration**: Uses `useSettingsStore` for language management
- **Mixed Translation Approach**: Some text uses translation keys, others use hardcoded conditions

### Target Architecture

- **next-intl Integration**: Uses `useTranslations` hook for all text content
- **Centralized Message Management**: All translations stored in JSON message files
- **Consistent Translation Keys**: Uniform approach to accessing translations
- **Namespace Organization**: Navbar translations organized under dedicated namespace

## Components and Interfaces

### Translation Hook Integration

```typescript
// Replace current approach
const { language } = useSettingsStore();
const t = translations[language];

// With next-intl approach
const t = useTranslations("Navbar");
```

### Message Structure

The navbar translations will be organized under a `Navbar` namespace in the message files:

```json
{
  "Navbar": {
    "marketplace": "Marketplace",
    "inventory": "Inventory",
    "cart": "Cart",
    "favorites": "Favorites",
    "profile": "Profile",
    "login": "Login",
    "logout": "Logout",
    "balance": "Balance",
    "paymentHistory": "Payment History",
    "adminPanel": "Admin Panel",
    "depositTooltip": "Add funds"
  }
}
```

### Component Dependencies

- **Remove**: `@/lib/translations` import
- **Remove**: `useSettingsStore` for language management
- **Add**: `useTranslations` from `next-intl`
- **Maintain**: All existing store dependencies (auth, cart, favorites)

## Data Models

### Translation Key Mapping

Current hardcoded patterns will be replaced with translation keys:

| Current Pattern                                                                  | Translation Key  |
| -------------------------------------------------------------------------------- | ---------------- |
| `language === 'uz' ? 'Inventar' : language === 'ru' ? 'Инвентарь' : 'Inventory'` | `t('inventory')` |
| `language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'`       | `t('profile')`   |
| `language === 'uz' ? 'Balans' : language === 'ru' ? 'Баланс' : 'Balance'`        | `t('balance')`   |

### Message File Updates

Each language file (uz.json, en.json, ru.json) will receive a new `Navbar` section containing all navbar-specific translations.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Now I'll analyze the acceptance criteria to determine which ones are testable as properties:

Based on the prework analysis, here are the testable correctness properties:

### Property 1: Translation Coverage Completeness

_For any_ navbar text element that was previously translated, there should exist a corresponding translation key in the next-intl message files
**Validates: Requirements 2.1**

### Property 2: Message File Structure Consistency

_For any_ translation key that exists in one language file, the same key should exist in all other language files (uz.json, en.json, ru.json)
**Validates: Requirements 2.6**

### Property 3: Navigation Elements Preservation

_For any_ navbar render, all expected navigation elements (marketplace, inventory, cart, favorites, profile links) should be present in the DOM
**Validates: Requirements 3.1**

### Property 4: Authentication State Rendering

_For any_ authentication state (logged in/logged out), the navbar should display the appropriate elements (user menu vs login button)
**Validates: Requirements 3.2**

### Property 5: Cart Badge Display

_For any_ cart state with items, the cart badge should display the correct item count
**Validates: Requirements 3.3**

### Property 6: Favorites Badge Display

_For any_ favorites state with items, the favorites badge should display the correct favorites count
**Validates: Requirements 3.4**

### Property 7: Click Handler Preservation

_For any_ clickable navbar element, clicking it should trigger the expected navigation or action
**Validates: Requirements 3.5**

### Property 8: Mobile Menu Functionality

_For any_ mobile viewport, the mobile menu should toggle open/closed when the menu button is clicked
**Validates: Requirements 3.7**

### Property 9: Translation Key Usage

_For any_ text element in the navbar, it should use translation keys rather than hardcoded text
**Validates: Requirements 6.3**

### Property 10: Auth Store Integration

_For any_ authentication state change, the navbar should reflect the change using the existing auth store logic
**Validates: Requirements 7.1**

### Property 11: Cart Store Integration

_For any_ cart state change, the navbar should reflect the change using the existing cart store logic  
**Validates: Requirements 7.2**

### Property 12: Favorites Store Integration

_For any_ favorites state change, the navbar should reflect the change using the existing favorites store logic
**Validates: Requirements 7.3**

### Property 13: Balance Display Functionality

_For any_ user balance and currency setting, the navbar should display the correctly converted balance
**Validates: Requirements 7.5**

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

- Auth store errors should not prevent navbar rendering
- Cart/favorites count errors should default to 0
- Currency conversion errors should fall back to original balance

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific scenarios and property-based tests for comprehensive coverage:

**Unit Tests:**

- Test specific translation key mappings
- Test authentication state transitions
- Test mobile menu toggle behavior
- Test cart/favorites badge display with specific counts
- Test error conditions and fallbacks

**Property-Based Tests:**

- Test translation coverage across all supported locales
- Test navbar rendering with random auth/cart/favorites states
- Test click handlers with various component states
- Test responsive behavior across different viewport sizes
- Test store integration with random state changes

**Testing Configuration:**

- Use React Testing Library for component testing
- Use Jest for unit tests and property-based testing with fast-check
- Minimum 100 iterations per property test
- Each property test tagged with: **Feature: navbar-next-intl-migration, Property {number}: {property_text}**

**Integration Testing:**

- Test navbar within full application context
- Test locale switching through next-intl routing
- Test store state persistence across navigation
- Test server-side rendering compatibility
