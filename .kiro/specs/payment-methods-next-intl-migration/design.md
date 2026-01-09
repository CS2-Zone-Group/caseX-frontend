# Design Document: PaymentMethods Next-intl Migration

## Overview

This design outlines the migration of the PaymentMethods.tsx component from custom translation logic to next-intl. The migration will replace manual language switching with next-intl's useTranslations hook, move hardcoded translations to JSON message files, and maintain all existing functionality while improving maintainability and consistency with the project's internationalization approach.

## Architecture

The migration follows a straightforward refactoring approach:

1. **Translation Hook Integration**: Replace custom translation logic with next-intl's useTranslations hook
2. **Message File Updates**: Move all hardcoded translations to the existing messages JSON structure
3. **Code Cleanup**: Remove custom translation imports and language switching logic
4. **Functionality Preservation**: Maintain all existing component behavior and styling

## Components and Interfaces

### PaymentMethods Component Changes

**Current Structure:**

```typescript
// Current imports
import { translations } from "@/lib/translations";
import { useSettingsStore } from "@/store/settingsStore";

// Current translation logic
const { language } = useSettingsStore();
const t = translations[language];

// Current hardcoded language conditions
{
  language === "uz"
    ? "Xavfsiz To'lov Usullari"
    : language === "ru"
    ? "Безопасные Способы Оплаты"
    : "Secure Payment Methods";
}
```

**New Structure:**

```typescript
// New imports
import { useTranslations } from "next-intl";

// New translation logic
const t = useTranslations("PaymentMethods");

// New translation usage
{
  t("title");
}
```

### Translation Key Structure

The component will use the following translation key hierarchy:

```typescript
PaymentMethods: {
  title: string;
  paymentMethods: {
    payme: string;
    click: string;
    uzum: string;
    paynet: string;
    visa: string;
    mastercard: string;
    bitcoin: string;
    ethereum: string;
    usdt: string;
    more: string;
  }
  moreMethods: string;
  transaction: string;
  fee: string;
  securityText: string;
  sslEncrypted: string;
  pciCertified: string;
}
```

## Data Models

### Message File Structure

Each language file (uz.json, en.json, ru.json) will be extended with:

```json
{
  "PaymentMethods": {
    "title": "Secure Payment Methods",
    "paymentMethods": {
      "payme": "Payme",
      "click": "Click",
      "uzum": "Uzum",
      "paynet": "Paynet",
      "visa": "Visa",
      "mastercard": "Mastercard",
      "bitcoin": "Bitcoin",
      "ethereum": "Ethereum",
      "usdt": "USDT",
      "more": "Others"
    },
    "moreMethods": "Various methods",
    "transaction": "Transaction",
    "fee": "FEE",
    "securityText": "All payments are secure and encrypted. We do not store your financial information.",
    "sslEncrypted": "SSL Encrypted",
    "pciCertified": "PCI DSS Certified"
  }
}
```

### Payment Methods Array Migration

The current payment methods array will be updated:

```typescript
// Current approach
const methods = [
  {
    name: t.payme,
    // ... other properties
  },
  // ... other methods
];

// New approach
const methods = [
  {
    name: t("paymentMethods.payme"),
    // ... other properties
  },
  // ... other methods
];
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Now I need to use the prework tool to analyze the acceptance criteria before writing the correctness properties:

Based on the prework analysis, I'll focus on the testable properties while noting that visual and styling aspects will be verified through manual testing:

### Property 1: Translation Hook Usage

_For any_ text content displayed in the PaymentMethods component, all translations should be accessed through the next-intl useTranslations hook rather than custom translation objects
**Validates: Requirements 1.2**

### Property 2: Message File Completeness

_For any_ text content displayed in the component, there should be corresponding translation keys in all three language message files (uz.json, en.json, ru.json)
**Validates: Requirements 2.1**

### Property 3: Payment Method Translation Consistency

_For any_ payment method displayed in the component, the translation should be retrieved from message files using consistent key patterns (paymentMethods.methodName)
**Validates: Requirements 3.1, 3.3**

### Property 4: Message Structure Consistency

_For any_ translation key defined in one language file, the same key structure should exist in all other language files
**Validates: Requirements 2.5**

### Property 5: Hardcoded Language Condition Removal

_For any_ text element in the component, there should be no hardcoded language conditions (language === 'uz' patterns)
**Validates: Requirements 5.3**

### Property 6: Translation Key Pattern Consistency

_For any_ translation key used in the component, it should follow consistent naming patterns and namespace structure
**Validates: Requirements 5.4**

### Property 7: Payment Method Name Preservation

_For any_ payment method, the translated text output should match the original text that was displayed before migration
**Validates: Requirements 3.4**

### Property 8: Component Data Display Preservation

_For any_ payment method data (name, limit, fee), the display format and content should remain identical to the pre-migration version
**Validates: Requirements 4.1, 4.4**

### Property 9: Security Text Translation

_For any_ security-related text (SSL, PCI DSS), the content should be retrieved from translation keys rather than hardcoded language conditions
**Validates: Requirements 5.2**

## Error Handling

The migration maintains the existing error handling approach:

1. **Missing Translation Keys**: If a translation key is missing, next-intl will fall back to the key name, preventing runtime errors
2. **Invalid Payment Method Data**: The component maintains existing data validation and display logic
3. **Rendering Errors**: Existing error boundaries and fallback mechanisms are preserved

## Testing Strategy

### Unit Tests

- Verify component renders without errors after migration
- Test that all expected payment method cards are displayed
- Verify security information section renders correctly
- Test message file structure and completeness
- Verify translation key usage and patterns

### Property-Based Tests

- **Property 1**: Test translation hook usage across all text content
- **Property 2**: Test message file completeness for all displayed content
- **Property 3**: Test payment method translation consistency
- **Property 4**: Test message structure consistency across language files
- **Property 5**: Test hardcoded language condition removal
- **Property 6**: Test translation key pattern consistency
- **Property 7**: Test payment method name preservation (round-trip)
- **Property 8**: Test component data display preservation
- **Property 9**: Test security text translation consistency

### Manual Testing

- Visual verification of styling and layout
- Responsive behavior testing
- Hover effects and transitions verification
- Cross-browser compatibility testing
- Payment method logo display verification

### Integration Tests

- Test component integration with next-intl locale switching
- Verify proper rendering in different language contexts
- Test component behavior within the larger application context

The testing approach balances automated verification of functional requirements with manual verification of visual and interactive elements that are difficult to test programmatically.
