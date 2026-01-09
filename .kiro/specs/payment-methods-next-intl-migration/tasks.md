# Implementation Plan: PaymentMethods Next-intl Migration

## Overview

This implementation plan converts the PaymentMethods.tsx component from custom translation logic to next-intl. The migration involves updating message files, replacing translation hooks, and removing hardcoded language conditions while preserving all existing functionality.

## Tasks

- [x] 1. Update message files with PaymentMethods translations

  - Add PaymentMethods section to all three language files (uz.json, en.json, ru.json)
  - Include translations for title, payment method names, and UI text
  - Include translations for security text and certification badges
  - Ensure consistent key structure across all language files
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ]\* 1.1 Write property test for message file completeness

  - **Property 2: Message File Completeness**
  - **Validates: Requirements 2.1**

- [ ]\* 1.2 Write property test for message structure consistency

  - **Property 4: Message Structure Consistency**
  - **Validates: Requirements 2.5**

- [x] 2. Migrate PaymentMethods component to use next-intl

  - [x] 2.1 Replace custom translation imports with next-intl useTranslations hook

    - Remove imports for custom translations and useSettingsStore
    - Add useTranslations import from next-intl
    - Replace translation logic with useTranslations('PaymentMethods')
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]\* 2.2 Write unit test for translation hook usage

    - **Property 1: Translation Hook Usage**
    - **Validates: Requirements 1.2**

  - [x] 2.3 Replace hardcoded language conditions with translation keys

    - Replace section title language conditions with t('title')
    - Replace security text language conditions with t('securityText')
    - Replace SSL and PCI DSS text with t('sslEncrypted') and t('pciCertified')
    - Remove all instances of language === 'uz' ? 'text' : ... patterns
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]\* 2.4 Write property test for hardcoded language condition removal
    - **Property 5: Hardcoded Language Condition Removal**
    - **Validates: Requirements 5.3**

- [x] 3. Migrate payment method names to translation keys

  - [x] 3.1 Replace payment method name references with translation keys

    - Update all t.payme, t.click, etc. to t('paymentMethods.payme'), t('paymentMethods.click')
    - Update t.transaction and t.fee to t('transaction') and t('fee')
    - Ensure consistent nested key structure under paymentMethods namespace
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [ ]\* 3.2 Write property test for payment method translation consistency

    - **Property 3: Payment Method Translation Consistency**
    - **Validates: Requirements 3.1, 3.3**

  - [ ]\* 3.3 Write property test for payment method name preservation
    - **Property 7: Payment Method Name Preservation**
    - **Validates: Requirements 3.4**

- [ ] 4. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Verify functionality preservation

  - [ ] 5.1 Test component rendering and data display

    - Verify all payment method cards render correctly
    - Verify payment method names, limits, and fees display properly
    - Verify payment method logos load and display correctly
    - Verify "More" payment methods card renders correctly
    - _Requirements: 4.1, 4.4, 4.5_

  - [ ]\* 5.2 Write property test for component data display preservation

    - **Property 8: Component Data Display Preservation**
    - **Validates: Requirements 4.1, 4.4**

  - [ ] 5.3 Test security information section

    - Verify security text displays correctly
    - Verify SSL and PCI DSS badges display correctly
    - Verify security section layout is preserved
    - _Requirements: 4.6, 5.2_

  - [ ]\* 5.4 Write property test for security text translation

    - **Property 9: Security Text Translation**
    - **Validates: Requirements 5.2**

  - [ ]\* 5.5 Write unit test for security information section
    - Test security section rendering and content
    - **Validates: Requirements 4.6**

- [ ] 6. Final cleanup and validation

  - [ ] 6.1 Remove unused imports and code

    - Remove unused router import
    - Remove any remaining custom translation imports
    - Remove unused language switching logic
    - Clean up any unused constants or functions
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]\* 6.2 Write integration tests for component behavior
    - Test component integration with next-intl locale switching
    - Test component rendering in different language contexts

- [ ] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Manual testing will be required for visual styling and animation verification
