# Implementation Plan: Next.js Page Migration to next-intl

## Overview

This implementation plan converts the home page component from using custom translation logic to next-intl. The migration involves updating message files with comprehensive translations, replacing custom hooks with next-intl's useTranslations, and removing manual language switching UI.

## Tasks

- [x] 1. Update messages JSON files with comprehensive translations

  - Analyze all text content in the current page component
  - Create structured translation keys for hero, stats, features, about, and footer sections
  - Update uz.json, en.json, and ru.json with all required translations
  - Ensure consistent key structure across all language files
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ]\* 1.1 Write property test for message structure consistency

  - **Property 2: Message Structure Consistency**
  - **Validates: Requirements 2.8**

- [x] 2. Migrate page component to use next-intl

  - [x] 2.1 Replace custom translation imports with useTranslations hook

    - Remove import of custom translations object
    - Remove useSettingsStore import for language management
    - Add useTranslations hook from next-intl
    - _Requirements: 1.1, 1.3, 1.4_

  - [x] 2.2 Update all text content to use translation keys

    - Replace all hardcoded text with translation key calls
    - Update hero section content (badge, title, description, buttons)
    - Update stats section labels
    - Update features section content
    - Update about section content
    - Update footer content
    - _Requirements: 1.2, 2.1_

  - [ ]\* 2.3 Write property test for translation key coverage
    - **Property 1: Translation Key Coverage**
    - **Validates: Requirements 1.2, 2.1**

- [x] 3. Update document title management

  - Replace manual title switching logic with next-intl translations
  - Use translation keys for document title in all languages
  - _Requirements: 6.1, 6.3_

- [ ]\* 3.1 Write property test for document title translation

  - **Property 6: Document Title Translation**
  - **Validates: Requirements 6.1, 6.2**

- [x] 4. Remove manual language switching UI

  - Remove language switching buttons from about section
  - Remove setLanguage function calls
  - Clean up unused language state management code
  - _Requirements: 4.1, 4.3, 4.4_

- [x] 5. Checkpoint - Verify functionality preservation

  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 5.1 Write property tests for functionality preservation

  - **Property 3: Content Section Preservation**
  - **Property 4: Navigation Link Preservation**
  - **Property 5: Interactive Element Preservation**
  - **Validates: Requirements 3.1, 3.2, 3.5**

- [x] 6. Final cleanup and validation

  - Remove any unused imports or dependencies
  - Verify TypeScript compilation without errors
  - Test page rendering in all three locales
  - _Requirements: 5.1, 5.2_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- The migration maintains all existing functionality while leveraging next-intl features
- No other files should be modified except page.tsx and messages JSON files
