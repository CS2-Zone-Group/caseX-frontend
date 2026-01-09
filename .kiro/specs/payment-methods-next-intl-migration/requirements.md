# Requirements Document

## Introduction

Migrate the existing PaymentMethods.tsx component from using custom translation logic and manual language switching to next-intl, which is already configured in the project. The migration should maintain all existing functionality while leveraging next-intl's built-in internationalization features and updating the messages JSON files with comprehensive payment methods translations.

## Glossary

- **PaymentMethods**: The payment methods component (src/components/PaymentMethods.tsx) that displays available payment options
- **next-intl**: The internationalization library already configured in the project
- **useTranslations**: next-intl hook for accessing translations
- **Messages**: JSON files containing translations for different locales (uz, en, ru)
- **Locale**: The language/region identifier (uz, en, ru)
- **Custom_Translation_Logic**: The current manual translation system using translations object and language switching
- **Payment_Method_Names**: The hardcoded payment method names (Payme, Click, Visa, etc.)
- **Security_Text**: The hardcoded security and certification text content

## Requirements

### Requirement 1: Replace Custom Translation Logic

**User Story:** As a developer, I want to use next-intl's useTranslations hook instead of custom translation logic, so that I can leverage standardized internationalization features.

#### Acceptance Criteria

1. WHEN the payment methods component renders, THE PaymentMethods SHALL use next-intl's useTranslations hook instead of custom translations object
2. WHEN translations are needed, THE PaymentMethods SHALL access them through the useTranslations hook
3. THE PaymentMethods SHALL remove the custom translations import and usage
4. THE PaymentMethods SHALL remove the manual language switching logic and useSettingsStore for language management
5. THE PaymentMethods SHALL remove the hardcoded language-specific text conditions

### Requirement 2: Update Messages JSON Files

**User Story:** As a content manager, I want comprehensive payment methods translations in the messages files, so that all payment methods content is properly internationalized.

#### Acceptance Criteria

1. WHEN messages are defined, THE Messages SHALL include all payment methods text content
2. THE Messages SHALL include translations for the section title "Secure Payment Methods"
3. THE Messages SHALL include translations for all payment method names (Payme, Click, Uzum, Paynet, Visa, Mastercard, Bitcoin, Ethereum, USDT)
4. THE Messages SHALL include translations for UI text ("Transaction", "FEE", "Various methods", "Others")
5. THE Messages SHALL maintain consistent structure across all three language files (uz.json, en.json, ru.json)
6. THE Messages SHALL organize payment methods translations under a "PaymentMethods" key for proper namespacing

### Requirement 3: Migrate Payment Method Names to Messages

**User Story:** As a developer, I want to move the hardcoded payment method names to the messages files, so that payment method translations are managed consistently with other content.

#### Acceptance Criteria

1. WHEN payment method names are displayed, THE PaymentMethods SHALL use translation keys instead of hardcoded t.payme, t.click, etc.
2. THE Messages SHALL include all payment method name translations in the appropriate language files
3. THE PaymentMethods SHALL use consistent translation key patterns for payment method names
4. THE PaymentMethods SHALL maintain the same payment method name output as before migration
5. THE PaymentMethods SHALL use nested translation keys under paymentMethods namespace

### Requirement 4: Maintain Existing Functionality

**User Story:** As a user, I want all existing payment methods functionality to continue working, so that the migration doesn't break the component behavior.

#### Acceptance Criteria

1. WHEN the payment methods section renders, THE PaymentMethods SHALL continue to display all existing payment method cards
2. THE PaymentMethods SHALL preserve all existing styling and grid layout
3. THE PaymentMethods SHALL maintain responsive behavior and hover effects
4. THE PaymentMethods SHALL continue to display payment method logos, limits, and fees correctly
5. THE PaymentMethods SHALL maintain the "More" payment methods card functionality
6. THE PaymentMethods SHALL preserve the security information section

### Requirement 5: Remove Hardcoded Language Conditions

**User Story:** As a developer, I want to remove hardcoded language conditions from the payment methods component, so that translations are handled consistently through next-intl.

#### Acceptance Criteria

1. WHEN displaying the section title, THE PaymentMethods SHALL use translation keys instead of language conditions
2. WHEN showing security text, THE PaymentMethods SHALL use translation keys instead of manual language switching
3. THE PaymentMethods SHALL remove all instances of `language === 'uz' ? 'text' : language === 'ru' ? 'текст' : 'text'` patterns
4. THE PaymentMethods SHALL use consistent translation key patterns for all text elements
5. THE PaymentMethods SHALL replace SSL and PCI DSS certification text with translation keys

### Requirement 6: Proper TypeScript Integration

**User Story:** As a developer, I want proper TypeScript support for payment methods translations, so that I have type safety and autocompletion.

#### Acceptance Criteria

1. WHEN using translations, THE PaymentMethods SHALL have proper TypeScript typing for translation keys
2. WHEN accessing nested translation objects, THE PaymentMethods SHALL maintain type safety
3. THE PaymentMethods SHALL use proper next-intl TypeScript patterns

### Requirement 7: Preserve Component Structure and Performance

**User Story:** As a user, I want the payment methods component to maintain its performance and visual structure, so that the user experience remains optimal.

#### Acceptance Criteria

1. WHEN the component renders, THE PaymentMethods SHALL maintain the same visual layout and grid structure
2. WHEN hover effects trigger, THE PaymentMethods SHALL preserve all card hover animations and transitions
3. THE PaymentMethods SHALL maintain the same component performance characteristics
4. THE PaymentMethods SHALL preserve the payment method logos and styling
5. THE PaymentMethods SHALL maintain the security badges and certification display

### Requirement 8: Clean Up Unused Code

**User Story:** As a developer, I want to remove unused imports and code after migration, so that the codebase remains clean and maintainable.

#### Acceptance Criteria

1. WHEN migration is complete, THE PaymentMethods SHALL remove unused router import
2. THE PaymentMethods SHALL remove any remaining custom translation imports
3. THE PaymentMethods SHALL remove unused language switching logic
4. THE PaymentMethods SHALL clean up any unused constants or functions
5. THE PaymentMethods SHALL maintain only necessary imports and dependencies
