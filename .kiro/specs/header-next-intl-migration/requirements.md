# Requirements Document

## Introduction

Migrate the existing Header.tsx component from using custom translation logic and manual language switching to next-intl, which is already configured in the project. The migration should maintain all existing functionality while leveraging next-intl's built-in internationalization features and updating the messages JSON files with comprehensive header translations.

## Glossary

- **Header**: The header component (src/components/Header.tsx) that provides basic site navigation and user interface
- **next-intl**: The internationalization library already configured in the project
- **useTranslations**: next-intl hook for accessing translations
- **Messages**: JSON files containing translations for different locales (uz, en, ru)
- **Locale**: The language/region identifier (uz, en, ru)
- **Custom_Translation_Logic**: The current manual translation system using translations object and language switching
- **Settings_Modal**: The settings modal component that is opened from the header

## Requirements

### Requirement 1: Replace Custom Translation Logic

**User Story:** As a developer, I want to use next-intl's useTranslations hook instead of custom translation logic, so that I can leverage standardized internationalization features.

#### Acceptance Criteria

1. WHEN the header component renders, THE Header SHALL use next-intl's useTranslations hook instead of custom translations object
2. WHEN translations are needed, THE Header SHALL access them through the useTranslations hook
3. THE Header SHALL remove the custom translations import and usage
4. THE Header SHALL remove the manual language switching logic and useSettingsStore for language management
5. THE Header SHALL remove the hardcoded language-specific text conditions

### Requirement 2: Update Messages JSON Files

**User Story:** As a content manager, I want comprehensive header translations in the messages files, so that all header content is properly internationalized.

#### Acceptance Criteria

1. WHEN messages are defined, THE Messages SHALL include all header text content
2. THE Messages SHALL include translations for navigation links (marketplace, cart, inventory, login, logout)
3. THE Messages SHALL include translations for settings tooltip text
4. THE Messages SHALL maintain consistent structure across all three language files (uz.json, en.json, ru.json)
5. THE Messages SHALL organize header translations under a "Header" key for proper namespacing

### Requirement 3: Maintain Existing Functionality

**User Story:** As a user, I want all existing header functionality to continue working, so that the migration doesn't break the navigation experience.

#### Acceptance Criteria

1. WHEN the header renders, THE Header SHALL continue to display all existing navigation elements
2. WHEN user authentication state changes, THE Header SHALL continue to show/hide appropriate elements
3. WHEN cart items are added, THE Header SHALL continue to display cart count badge
4. THE Header SHALL maintain all existing click handlers and navigation logic
5. THE Header SHALL preserve all existing styling and responsive behavior
6. THE Header SHALL maintain settings modal functionality

### Requirement 4: Remove Hardcoded Language Conditions

**User Story:** As a developer, I want to remove hardcoded language conditions from the header, so that translations are handled consistently through next-intl.

#### Acceptance Criteria

1. WHEN displaying navigation links, THE Header SHALL use translation keys instead of language conditions
2. WHEN showing settings tooltip, THE Header SHALL use translation keys instead of manual language switching
3. THE Header SHALL remove all instances of `language === 'uz' ? 'text' : language === 'ru' ? 'текст' : 'text'` patterns
4. THE Header SHALL use consistent translation key patterns for all text elements

### Requirement 5: Proper TypeScript Integration

**User Story:** As a developer, I want proper TypeScript support for header translations, so that I have type safety and autocompletion.

#### Acceptance Criteria

1. WHEN using translations, THE Header SHALL have proper TypeScript typing for translation keys
2. WHEN accessing nested translation objects, THE Header SHALL maintain type safety
3. THE Header SHALL use proper next-intl TypeScript patterns

### Requirement 6: Navigation Link Consistency

**User Story:** As a user, I want consistent navigation link text across all languages, so that the interface is predictable and professional.

#### Acceptance Criteria

1. WHEN navigation links are displayed, THE Header SHALL use consistent translation keys
2. WHEN user menu items are shown, THE Header SHALL use consistent translation patterns
3. THE Header SHALL ensure all interactive text elements are properly translated
4. THE Header SHALL maintain semantic meaning across all language translations

### Requirement 7: Preserve Authentication and State Management

**User Story:** As a user, I want all authentication and state management to continue working, so that user experience is not disrupted.

#### Acceptance Criteria

1. WHEN user authentication occurs, THE Header SHALL continue to use existing auth store logic
2. WHEN cart state changes, THE Header SHALL continue to use existing cart store logic
3. THE Header SHALL maintain all existing useEffect hooks and state management
4. THE Header SHALL preserve currency conversion and balance display functionality
5. THE Header SHALL maintain settings store integration for currency display

### Requirement 8: Settings Modal Integration

**User Story:** As a user, I want the settings modal to continue working properly, so that I can access application settings.

#### Acceptance Criteria

1. WHEN settings button is clicked, THE Header SHALL open the settings modal
2. WHEN settings modal is closed, THE Header SHALL properly handle the modal state
3. THE Header SHALL maintain proper tooltip text for the settings button
4. THE Header SHALL preserve all existing settings modal functionality
