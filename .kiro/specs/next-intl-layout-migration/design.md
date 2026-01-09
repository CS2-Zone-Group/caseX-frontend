# Design Document: Next-intl Layout Migration

## Overview

This design outlines the migration of the existing layout.tsx file from using a custom LanguageProvider to next-intl's NextIntlClientProvider. The migration will leverage the already configured next-intl setup while maintaining all existing functionality including theme management, store rehydration, and exchange rate fetching.

## Architecture

The layout component will be refactored to:

1. Accept a `locale` parameter from the Next.js dynamic route
2. Use next-intl's `NextIntlClientProvider` instead of the custom `LanguageProvider`
3. Load messages dynamically based on the locale
4. Maintain all existing client-side functionality

## Components and Interfaces

### Layout Component Interface

```typescript
interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}
```

### Dependencies

- `next-intl/client`: For NextIntlClientProvider
- `@/store/authStore`: Existing auth store (unchanged)
- `@/store/settingsStore`: Existing settings store (unchanged)
- `@/lib/currency`: Existing currency utilities (unchanged)

## Data Models

### Message Loading

Messages will be loaded dynamically using dynamic imports:

```typescript
const messages = await import(`../../../messages/${locale}.json`);
```

### Locale Validation

The locale parameter will be validated against the configured locales from the routing configuration.

## Implementation Details

### 1. Component Structure

The layout will be restructured to:

- Accept `params` containing the locale
- Load messages for the current locale
- Wrap children with NextIntlClientProvider
- Maintain existing useEffect logic

### 2. Message Loading Strategy

Messages will be loaded using dynamic imports within a useEffect hook to ensure client-side compatibility while maintaining the existing "use client" directive.

### 3. Locale Handling

The HTML lang attribute will be set dynamically based on the locale parameter, replacing the hardcoded "uz" value.

## Error Handling

- Invalid locales will fall back to the default locale ("uz")
- Message loading errors will be handled gracefully
- Existing error handling for store rehydration and theme application will be preserved

## Testing Strategy

### Unit Tests

- Test locale parameter handling
- Test message loading for different locales
- Test fallback behavior for invalid locales
- Test preservation of existing functionality

### Integration Tests

- Test complete layout rendering with different locales
- Test theme application after migration
- Test store rehydration behavior

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: NextIntlClientProvider Usage

_For any_ layout render, the component tree should contain NextIntlClientProvider and should not contain the custom LanguageProvider
**Validates: Requirements 1.1, 1.4**

### Property 2: Locale Parameter Propagation

_For any_ valid locale parameter, the NextIntlClientProvider should receive that exact locale value
**Validates: Requirements 1.2, 3.1**

### Property 3: Message Loading

_For any_ supported locale, messages should be loaded correctly and made available to the next-intl provider
**Validates: Requirements 1.3, 4.2**

### Property 4: Theme Application Preservation

_For any_ theme setting, the theme application logic should continue to work identically to the original implementation
**Validates: Requirements 2.1**

### Property 5: Store Rehydration Preservation

_For any_ store state, the rehydration logic should continue to work identically to the original implementation
**Validates: Requirements 2.2**

### Property 6: Exchange Rate Fetching Preservation

_For any_ layout render, the exchange rate fetching should continue to be triggered as in the original implementation
**Validates: Requirements 2.3**

### Property 7: HTML Lang Attribute

_For any_ locale parameter, the HTML element's lang attribute should be set to that locale value
**Validates: Requirements 3.2**

## Updated Testing Strategy

### Unit Tests

- Test locale parameter handling with specific examples
- Test message loading for each supported locale (uz, en, ru)
- Test fallback behavior for invalid locales
- Test preservation of existing functionality components

### Property Tests

- Verify NextIntlClientProvider usage across all renders
- Verify locale propagation for all valid locales
- Verify message loading for all supported locales
- Verify theme application preservation across all theme settings
- Verify store rehydration preservation across all store states
- Verify exchange rate fetching preservation
- Verify HTML lang attribute setting for all locales

Both unit tests and property tests are complementary and necessary for comprehensive coverage. Unit tests will focus on specific examples and edge cases, while property tests will verify universal behaviors across all inputs.
