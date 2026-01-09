# Implementation Plan: Next-intl Layout Migration

## Overview

This implementation plan converts the existing layout.tsx from using a custom LanguageProvider to next-intl's NextIntlClientProvider while preserving all existing functionality including theme management, store rehydration, and exchange rate fetching.

## Tasks

- [x] 1. Update layout component interface and imports

  - Modify the component to accept params with locale
  - Replace LanguageProvider import with NextIntlClientProvider from next-intl
  - Add necessary TypeScript types for the new interface
  - _Requirements: 1.1, 1.4, 3.3_

- [ ]\* 1.1 Write property test for provider replacement

  - **Property 1: NextIntlClientProvider Usage**
  - **Validates: Requirements 1.1, 1.4**

- [x] 2. Implement message loading logic

  - Add state management for messages
  - Implement dynamic message loading based on locale parameter
  - Add error handling for message loading failures
  - _Requirements: 1.3, 4.2_

- [ ]\* 2.1 Write property test for message loading

  - **Property 3: Message Loading**
  - **Validates: Requirements 1.3, 4.2**

- [x] 3. Update locale handling

  - Replace hardcoded "uz" lang attribute with dynamic locale
  - Ensure locale parameter is passed to NextIntlClientProvider
  - Add locale validation and fallback logic
  - _Requirements: 1.2, 3.1, 3.2_

- [ ]\* 3.1 Write property test for locale propagation

  - **Property 2: Locale Parameter Propagation**
  - **Validates: Requirements 1.2, 3.1**

- [ ]\* 3.2 Write property test for HTML lang attribute

  - **Property 7: HTML Lang Attribute**
  - **Validates: Requirements 3.2**

- [x] 4. Preserve existing functionality

  - Ensure all existing useEffect logic remains intact
  - Verify theme application logic is preserved
  - Verify store rehydration logic is preserved
  - Verify exchange rate fetching is preserved
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]\* 4.1 Write property test for theme preservation

  - **Property 4: Theme Application Preservation**
  - **Validates: Requirements 2.1**

- [ ]\* 4.2 Write property test for store rehydration preservation

  - **Property 5: Store Rehydration Preservation**
  - **Validates: Requirements 2.2**

- [ ]\* 4.3 Write property test for exchange rate fetching preservation

  - **Property 6: Exchange Rate Fetching Preservation**
  - **Validates: Requirements 2.3**

- [x] 5. Update component structure

  - Wrap children with NextIntlClientProvider instead of LanguageProvider
  - Pass messages and locale to the provider
  - Ensure proper component hierarchy is maintained
  - _Requirements: 1.1, 1.2_

- [x] 6. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 7. Write unit tests for specific scenarios

  - Test each supported locale (uz, en, ru) individually
  - Test fallback behavior for invalid locales
  - Test error handling for message loading failures
  - _Requirements: 1.3, 3.1, 4.2_

- [x] 8. Final integration and cleanup

  - Remove any unused imports
  - Verify TypeScript compilation
  - Ensure no breaking changes to existing functionality
  - _Requirements: 1.4, 2.4_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The migration maintains the "use client" directive for client-side functionality
