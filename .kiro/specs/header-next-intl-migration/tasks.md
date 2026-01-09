# Implementation Plan: Header next-intl Migration

## Overview

This implementation plan converts the Header.tsx component from using custom translation logic to next-intl. The migration will be done incrementally, first updating the message files with header translations, then migrating the component to use next-intl hooks, and finally testing the integration.

## Tasks

- [x] 1. Update message files with header translations

  - Add comprehensive header translations to all three language files (uz.json, en.json, ru.json)
  - Organize translations under "Header" namespace for proper structure
  - Include all navigation links, UI elements, and settings tooltip text
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]\* 1.1 Write property test for message file structure consistency

  - **Property 2: Message File Structure Consistency**
  - **Validates: Requirements 2.4**

- [x] 2. Migrate Header component to use next-intl

  - [x] 2.1 Replace custom translation imports with next-intl useTranslations hook

    - Remove `@/lib/translations` import
    - Remove `useSettingsStore` for language management (keep for currency)
    - Add `useTranslations('Header')` hook
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Replace hardcoded language conditions with translation keys

    - Convert settings tooltip language condition to `t('settingsTooltip')`
    - Use consistent `t('key')` pattern for all text elements
    - Update navigation links and UI text
    - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4_

  - [ ]\* 2.3 Write property test for translation hook integration

    - **Property 1: Translation Hook Integration**
    - **Validates: Requirements 1.1, 1.2**

  - [ ]\* 2.4 Write property test for translation key consistency
    - **Property 9: Translation Key Consistency**
    - **Validates: Requirements 4.1, 4.2, 4.4, 6.1, 6.2, 6.3**

- [x] 3. Test header functionality preservation

  - [x] 3.1 Verify navigation elements are preserved

    - Ensure all navigation links render correctly
    - Test that authentication state controls element visibility
    - _Requirements: 3.1, 3.2_

  - [ ]\* 3.2 Write property test for navigation elements preservation

    - **Property 4: Navigation Elements Preservation**
    - **Validates: Requirements 3.1**

  - [ ]\* 3.3 Write property test for authentication state rendering
    - **Property 5: Authentication State Rendering**
    - **Validates: Requirements 3.2**

- [x] 4. Test badge and counter functionality

  - [x] 4.1 Verify cart badge works correctly

    - Test cart item count badge display
    - Ensure badge updates when cart store state changes
    - _Requirements: 3.3_

  - [ ]\* 4.2 Write property test for cart badge display
    - **Property 6: Cart Badge Display**
    - **Validates: Requirements 3.3**

- [x] 5. Test interactive functionality

  - [x] 5.1 Verify click handlers and navigation work

    - Test all navigation links function correctly
    - Test settings button opens modal correctly
    - _Requirements: 3.4, 8.1, 8.2_

  - [ ]\* 5.2 Write property test for click handler preservation

    - **Property 7: Click Handler Preservation**
    - **Validates: Requirements 3.4**

  - [ ]\* 5.3 Write property test for settings modal integration
    - **Property 8: Settings Modal Integration**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

- [x] 6. Test store integration

  - [x] 6.1 Verify all store integrations work correctly

    - Test auth store integration and user state display
    - Test cart store integration and item count updates
    - Test currency display and settings store integration
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [ ]\* 6.2 Write property test for auth store integration

    - **Property 10: Auth Store Integration**
    - **Validates: Requirements 7.1**

  - [ ]\* 6.3 Write property test for cart store integration

    - **Property 11: Cart Store Integration**
    - **Validates: Requirements 7.2**

  - [ ]\* 6.4 Write property test for state management preservation

    - **Property 12: State Management Preservation**
    - **Validates: Requirements 7.3**

  - [ ]\* 6.5 Write property test for currency display functionality
    - **Property 13: Currency Display Functionality**
    - **Validates: Requirements 7.4, 7.5**

- [x] 7. Write comprehensive translation coverage test

  - [ ]\* 7.1 Write property test for translation coverage completeness
    - **Property 3: Translation Coverage Completeness**
    - **Validates: Requirements 2.1**

- [x] 8. Final integration testing and cleanup

  - [x] 8.1 Test header in full application context

    - Verify header works correctly with next-intl routing
    - Test locale switching through application navigation
    - Ensure no TypeScript errors or warnings
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4_

  - [x] 8.2 Clean up unused code and imports
    - Remove any unused translation-related code
    - Ensure proper TypeScript typing throughout
    - Update any related documentation or comments
    - _Requirements: 1.3, 1.4_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using React Testing Library and fast-check
- Unit tests validate specific examples and edge cases
- The migration maintains all existing functionality while adopting next-intl patterns
- All store integrations (auth, cart, settings) are preserved during migration
- Settings store integration is maintained for currency display functionality
