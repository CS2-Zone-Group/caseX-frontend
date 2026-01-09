# Implementation Plan: PopularItems Next-intl Migration

## Overview

This implementation plan converts the PopularItems.tsx component from custom translation logic to next-intl. The migration involves updating message files, replacing translation hooks, and removing hardcoded language conditions while preserving all existing functionality.

## Tasks

- [x] 1. Update message files with PopularItems translations

  - Add PopularItems section to all three language files (uz.json, en.json, ru.json)
  - Include translations for title, UI text, and skin conditions
  - Ensure consistent key structure across all language files
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ]\* 1.1 Write property test for message file completeness

  - **Property 2: Message File Completeness**
  - **Validates: Requirements 2.1**

- [ ]\* 1.2 Write property test for message structure consistency

  - **Property 4: Message Structure Consistency**
  - **Validates: Requirements 2.5**

- [x] 2. Migrate PopularItems component to use next-intl

  - [x] 2.1 Replace custom translation imports with next-intl useTranslations hook

    - Remove imports for custom translations and useSettingsStore
    - Add useTranslations import from next-intl
    - Replace translation logic with useTranslations('PopularItems')
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]\* 2.2 Write unit test for translation hook usage

    - **Property 1: Translation Hook Usage**
    - **Validates: Requirements 1.2**

  - [x] 2.3 Replace hardcoded language conditions with translation keys

    - Replace section title language conditions with t('title')
    - Replace "View All Items" button language conditions with t('viewAllItems')
    - Remove all instances of language === 'uz' ? 'text' : ... patterns
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]\* 2.4 Write property test for translation key pattern consistency
    - **Property 5: Translation Key Pattern Consistency**
    - **Validates: Requirements 3.4, 5.4**

- [x] 3. Migrate skin condition translations

  - [x] 3.1 Replace floatDict with translation-based condition mapping

    - Remove the hardcoded floatDict constant
    - Create condition mapping function using translation keys
    - Update tFloat function to use translation keys
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]\* 3.2 Write property test for skin condition translation consistency

    - **Property 3: Skin Condition Translation Consistency**
    - **Validates: Requirements 3.1**

  - [ ]\* 3.3 Write property test for skin condition text preservation
    - **Property 6: Skin Condition Text Preservation**
    - **Validates: Requirements 3.5**

- [ ] 4. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Verify functionality preservation

  - [x] 5.1 Test component rendering and data display

    - Verify all skin items render correctly
    - Verify prices, names, and conditions display properly
    - Verify images load and display correctly
    - _Requirements: 4.1, 4.6_

  - [ ]\* 5.2 Write property test for component data display preservation

    - **Property 7: Component Data Display Preservation**
    - **Validates: Requirements 4.1, 4.6**

  - [x] 5.3 Test navigation functionality

    - Verify skin item clicks navigate to marketplace with correct filters
    - Verify "View All Items" button navigates to marketplace
    - _Requirements: 4.2, 4.3_

  - [ ]\* 5.4 Write property test for navigation behavior preservation

    - **Property 8: Navigation Behavior Preservation**
    - **Validates: Requirements 4.2**

  - [ ]\* 5.5 Write unit test for "View All Items" button navigation
    - Test button click navigation behavior
    - **Validates: Requirements 4.3**

- [ ] 6. Final cleanup and validation

  - [x] 6.1 Remove unused imports and code

    - Remove any remaining custom translation imports
    - Remove unused language switching logic
    - Clean up any unused constants or functions
    - _Requirements: 1.3, 1.4, 1.5_

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
