# Requirements Document

## Introduction

Migrate the existing page.tsx file from using custom translation logic and manual language switching to next-intl, which is already configured in the project. The migration should maintain all existing functionality while leveraging next-intl's built-in internationalization features and updating the messages JSON files with comprehensive translations.

## Glossary

- **Page**: The home page component (src/app/[locale]/page.tsx) that displays the main landing page
- **next-intl**: The internationalization library already configured in the project
- **useTranslations**: next-intl hook for accessing translations
- **Messages**: JSON files containing translations for different locales (uz, en, ru)
- **Locale**: The language/region identifier (uz, en, ru)
- **Custom_Translation_Logic**: The current manual translation system using translations object and language switching

## Requirements

### Requirement 1: Replace Custom Translation Logic

**User Story:** As a developer, I want to use next-intl's useTranslations hook instead of custom translation logic, so that I can leverage standardized internationalization features.

#### Acceptance Criteria

1. WHEN the page component renders, THE Page SHALL use next-intl's useTranslations hook instead of custom translations object
2. WHEN translations are needed, THE Page SHALL access them through the useTranslations hook
3. THE Page SHALL remove the custom translations import and usage
4. THE Page SHALL remove the manual language switching logic and useSettingsStore for language management

### Requirement 2: Update Messages JSON Files

**User Story:** As a content manager, I want comprehensive translations in the messages files, so that all page content is properly internationalized.

#### Acceptance Criteria

1. WHEN messages are defined, THE Messages SHALL include all text content from the page component
2. WHEN organizing translations, THE Messages SHALL group related content logically (hero, features, stats, etc.)
3. THE Messages SHALL include translations for hero section content (title, description, buttons)
4. THE Messages SHALL include translations for statistics section (labels and descriptions)
5. THE Messages SHALL include translations for features section (titles and descriptions)
6. THE Messages SHALL include translations for about section content
7. THE Messages SHALL include translations for footer content
8. THE Messages SHALL maintain consistent structure across all three language files (uz.json, en.json, ru.json)

### Requirement 3: Maintain Existing Functionality

**User Story:** As a user, I want all existing functionality to continue working, so that the migration doesn't break the application.

#### Acceptance Criteria

1. WHEN the page renders, THE Page SHALL continue to display all existing content sections
2. WHEN navigation occurs, THE Page SHALL maintain all existing links and routing
3. WHEN the page loads, THE Page SHALL continue to update the document title appropriately
4. THE Page SHALL preserve all existing styling and layout
5. THE Page SHALL maintain all existing interactive elements and their functionality

### Requirement 4: Remove Language Switching UI

**User Story:** As a developer, I want to remove manual language switching from the page, so that language management is handled by next-intl routing.

#### Acceptance Criteria

1. WHEN the about section renders, THE Page SHALL remove the manual language switching buttons
2. THE Page SHALL rely on next-intl's routing for language switching
3. THE Page SHALL remove setLanguage function calls and language state management
4. THE Page SHALL remove useSettingsStore import and usage for language management

### Requirement 5: Proper TypeScript Integration

**User Story:** As a developer, I want proper TypeScript support for translations, so that I have type safety and autocompletion.

#### Acceptance Criteria

1. WHEN using translations, THE Page SHALL have proper TypeScript typing for translation keys
2. WHEN accessing nested translation objects, THE Page SHALL maintain type safety
3. THE Page SHALL use proper next-intl TypeScript patterns

### Requirement 6: Document Title Management

**User Story:** As a user, I want the page title to be set correctly based on the current locale, so that the browser tab shows the appropriate title.

#### Acceptance Criteria

1. WHEN the page loads, THE Page SHALL set the document title using next-intl translations
2. WHEN the locale changes, THE Page SHALL update the document title accordingly
3. THE Page SHALL remove the manual title switching logic and use translation keys instead
