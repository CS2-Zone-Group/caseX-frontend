# Implementation Plan: Navbar next-intl Migration

## Overview

This implementation plan converts the Navbar.tsx component from using custom translation logic to next-intl. The migration will be done incrementally, first updating the message files with navbar translations, then migrating the component to use next-intl hooks, and finally testing the integration.

## Tasks

- [x] 1. Update message files with navbar translations

  - Add comprehensive navbar translations to all three language files (uz.json, en.json, ru.json)
  - Organize translations under "Navbar" namespace for proper structure
  - Include all navigation links, UI elements, and user interface text
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ]\* 1.1 Write property test for message file structure consistency

  - **Property 2: Message File Structure Consistency**
  - **Validates: Requirements 2.6**

- [x] 2. Migrate Navbar component to use next-intl

  - [x] 2.1 Replace custom translation imports with next-intl useTranslations hook

    - Remove `@/lib/translations` import
    - Remove `useSettingsStore` for language management
    - Add `useTranslations('Navbar')` hook
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Replace hardcoded language conditions with translation keys

    - Convert all `language === 'uz' ? 'text' : language === 'ru' ? 'текст' : 'text'` patterns
    - Use consistent `t('key')` pattern for all text elements
    - Update navigation links, user menu items, and UI text
    - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4_

  - [ ]\* 2.3 Write property test for translation key usage
    - **Property 9: Translation Key Usage**
    - **Validates: Requirements 6.3**

- [x] 3. Test navbar functionality preservation

  - [x] 3.1 Verify navigation elements are preserved

    - Ensure all navigation links render correctly
    - Test that authentication state controls element visibility
    - _Requirements: 3.1, 3.2_

  - [ ]\* 3.2 Write property test for navigation elements preservation

    - **Property 3: Navigation Elements Preservation**
    - **Validates: Requirements 3.1**

  - [ ]\* 3.3 Write property test for authentication state rendering
    - **Property 4: Authentication State Rendering**
    - **Validates: Requirements 3.2**

- [x] 4. Test badge and counter functionality

  - [x] 4.1 Verify cart and favorites badges work correctly

    - Test cart item count badge display
    - Test favorites count badge display
    - Ensure badges update when store state changes
    - _Requirements: 3.3, 3.4_

  - [ ]\* 4.2 Write property test for cart badge display

    - **Property 5: Cart Badge Display**
    - **Validates: Requirements 3.3**

  - [ ]\* 4.3 Write property test for favorites badge display
    - **Property 6: Favorites Badge Display**
    - **Validates: Requirements 3.4**

- [x] 5. Test interactive functionality

  - [x] 5.1 Verify click handlers and navigation work

    - Test all navigation links function correctly
    - Test mobile menu toggle functionality
    - Test user menu dropdown behavior
    - _Requirements: 3.5, 3.7_

  - [ ]\* 5.2 Write property test for click handler preservation

    - **Property 7: Click Handler Preservation**
    - **Validates: Requirements 3.5**

  - [ ]\* 5.3 Write property test for mobile menu functionality
    - **Property 8: Mobile Menu Functionality**
    - **Validates: Requirements 3.7**

- [x] 6. Test store integration

  - [x] 6.1 Verify all store integrations work correctly

    - Test auth store integration and user state display
    - Test cart store integration and item count updates
    - Test favorites store integration and count updates
    - Test balance display and currency conversion
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [ ]\* 6.2 Write property test for auth store integration

    - **Property 10: Auth Store Integration**
    - **Validates: Requirements 7.1**

  - [ ]\* 6.3 Write property test for cart store integration

    - **Property 11: Cart Store Integration**
    - **Validates: Requirements 7.2**

  - [ ]\* 6.4 Write property test for favorites store integration

    - **Property 12: Favorites Store Integration**
    - **Validates: Requirements 7.3**

  - [ ]\* 6.5 Write property test for balance display functionality
    - **Property 13: Balance Display Functionality**
    - **Validates: Requirements 7.5**

- [x] 7. Write comprehensive translation coverage test

  - [ ]\* 7.1 Write property test for translation coverage completeness
    - **Property 1: Translation Coverage Completeness**
    - **Validates: Requirements 2.1**

- [x] 8. Final integration testing and cleanup

  - [x] 8.1 Test navbar in full application context

    - Verify navbar works correctly with next-intl routing
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
- All store integrations (auth, cart, favorites) are preserved during migration
