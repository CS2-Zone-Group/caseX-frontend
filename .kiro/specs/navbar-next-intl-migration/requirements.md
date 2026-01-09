# Requirements Document

## Introduction

Migrate the existing Navbar.tsx component from using custom translation logic and manual language switching to next-intl, which is already configured in the project. The migration should maintain all existing functionality while leveraging next-intl's built-in internationalization features and updating the messages JSON files with comprehensive navbar translations.

## Glossary

- **Navbar**: The navigation component (src/components/Navbar.tsx) that provides site navigation and user interface
- **next-intl**: The internationalization library already configured in the project
- **useTranslations**: next-intl hook for accessing translations
- **Messages**: JSON files containing translations for different locales (uz, en, ru)
- **Locale**: The language/region identifier (uz, en, ru)
- **Custom_Translation_Logic**: The current manual translation system using translations object and language switching
- **Navigation_Links**: Links and text elements in the navbar that need translation

## Requirements

### Requirement 1: Replace Custom Translation Logic

**User Story:** As a developer, I want to use next-intl's useTranslations hook instead of custom translation logic, so that I can leverage standardized internationalization features.

#### Acceptance Criteria

1. WHEN the navbar component renders, THE Navbar SHALL use next-intl's useTranslations hook instead of custom translations object
2. WHEN translations are needed, THE Navbar SHALL access them through the useTranslations hook
3. THE Navbar SHALL remove the custom translations import and usage
4. THE Navbar SHALL remove the manual language switching logic and useSettingsStore for language management
5. THE Navbar SHALL remove the hardcoded language-specific text conditions

### Requirement 2: Update Messages JSON Files

**User Story:** As a content manager, I want comprehensive navbar translations in the messages files, so that all navbar content is properly internationalized.

#### Acceptance Criteria

1. WHEN messages are defined, THE Messages SHALL include all navbar text content
2. THE Messages SHALL include translations for navigation links (marketplace, inventory, cart, favorites, profile)
3. THE Messages SHALL include translations for user interface elements (login, logout, balance, payment history)
4. THE Messages SHALL include translations for admin panel link
5. THE Messages SHALL include translations for deposit button tooltip
6. THE Messages SHALL maintain consistent structure across all three language files (uz.json, en.json, ru.json)
7. THE Messages SHALL organize navbar translations under a "Navbar" key for proper namespacing

### Requirement 3: Maintain Existing Functionality

**User Story:** As a user, I want all existing navbar functionality to continue working, so that the migration doesn't break the navigation experience.

#### Acceptance Criteria

1. WHEN the navbar renders, THE Navbar SHALL continue to display all existing navigation elements
2. WHEN user authentication state changes, THE Navbar SHALL continue to show/hide appropriate elements
3. WHEN cart items are added, THE Navbar SHALL continue to display cart count badge
4. WHEN favorites are added, THE Navbar SHALL continue to display favorites count badge
5. THE Navbar SHALL maintain all existing click handlers and navigation logic
6. THE Navbar SHALL preserve all existing styling and responsive behavior
7. THE Navbar SHALL maintain mobile menu functionality

### Requirement 4: Remove Hardcoded Language Conditions

**User Story:** As a developer, I want to remove hardcoded language conditions from the navbar, so that translations are handled consistently through next-intl.

#### Acceptance Criteria

1. WHEN displaying navigation links, THE Navbar SHALL use translation keys instead of language conditions
2. WHEN showing user profile elements, THE Navbar SHALL use translation keys instead of manual language switching
3. THE Navbar SHALL remove all instances of `language === 'uz' ? 'text' : language === 'ru' ? 'текст' : 'text'` patterns
4. THE Navbar SHALL use consistent translation key patterns for all text elements

### Requirement 5: Proper TypeScript Integration

**User Story:** As a developer, I want proper TypeScript support for navbar translations, so that I have type safety and autocompletion.

#### Acceptance Criteria

1. WHEN using translations, THE Navbar SHALL have proper TypeScript typing for translation keys
2. WHEN accessing nested translation objects, THE Navbar SHALL maintain type safety
3. THE Navbar SHALL use proper next-intl TypeScript patterns

### Requirement 6: Navigation Link Consistency

**User Story:** As a user, I want consistent navigation link text across all languages, so that the interface is predictable and professional.

#### Acceptance Criteria

1. WHEN navigation links are displayed, THE Navbar SHALL use consistent translation keys
2. WHEN user menu items are shown, THE Navbar SHALL use consistent translation patterns
3. THE Navbar SHALL ensure all interactive text elements are properly translated
4. THE Navbar SHALL maintain semantic meaning across all language translations

### Requirement 7: Preserve Authentication and State Management

**User Story:** As a user, I want all authentication and state management to continue working, so that user experience is not disrupted.

#### Acceptance Criteria

1. WHEN user authentication occurs, THE Navbar SHALL continue to use existing auth store logic
2. WHEN cart state changes, THE Navbar SHALL continue to use existing cart store logic
3. WHEN favorites state changes, THE Navbar SHALL continue to use existing favorites store logic
4. THE Navbar SHALL maintain all existing useEffect hooks and state management
5. THE Navbar SHALL preserve currency conversion and balance display functionality
