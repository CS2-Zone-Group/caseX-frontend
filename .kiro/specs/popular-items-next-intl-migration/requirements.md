# Requirements Document

## Introduction

Migrate the existing PopularItems.tsx component from using custom translation logic and manual language switching to next-intl, which is already configured in the project. The migration should maintain all existing functionality while leveraging next-intl's built-in internationalization features and updating the messages JSON files with comprehensive popular items translations.

## Glossary

- **PopularItems**: The popular items component (src/components/PopularItems.tsx) that displays featured CS2 skins
- **next-intl**: The internationalization library already configured in the project
- **useTranslations**: next-intl hook for accessing translations
- **Messages**: JSON files containing translations for different locales (uz, en, ru)
- **Locale**: The language/region identifier (uz, en, ru)
- **Custom_Translation_Logic**: The current manual translation system using translations object and language switching
- **Float_Dictionary**: The hardcoded floatDict object containing skin condition translations
- **Skin_Conditions**: CS2 skin wear conditions (Factory New, Minimal Wear, etc.)

## Requirements

### Requirement 1: Replace Custom Translation Logic

**User Story:** As a developer, I want to use next-intl's useTranslations hook instead of custom translation logic, so that I can leverage standardized internationalization features.

#### Acceptance Criteria

1. WHEN the popular items component renders, THE PopularItems SHALL use next-intl's useTranslations hook instead of custom translations object
2. WHEN translations are needed, THE PopularItems SHALL access them through the useTranslations hook
3. THE PopularItems SHALL remove the custom translations import and usage
4. THE PopularItems SHALL remove the manual language switching logic and useSettingsStore for language management
5. THE PopularItems SHALL remove the hardcoded language-specific text conditions

### Requirement 2: Update Messages JSON Files

**User Story:** As a content manager, I want comprehensive popular items translations in the messages files, so that all popular items content is properly internationalized.

#### Acceptance Criteria

1. WHEN messages are defined, THE Messages SHALL include all popular items text content
2. THE Messages SHALL include translations for the section title "Popular Items"
3. THE Messages SHALL include translations for skin condition labels (Factory New, Minimal Wear, Field-Tested, Well-Worn, Battle-Scarred)
4. THE Messages SHALL include translations for UI text ("Start from:", "View All Items")
5. THE Messages SHALL maintain consistent structure across all three language files (uz.json, en.json, ru.json)
6. THE Messages SHALL organize popular items translations under a "PopularItems" key for proper namespacing

### Requirement 3: Migrate Float Dictionary to Messages

**User Story:** As a developer, I want to move the hardcoded float dictionary to the messages files, so that skin condition translations are managed consistently with other content.

#### Acceptance Criteria

1. WHEN skin conditions are displayed, THE PopularItems SHALL use translation keys instead of the hardcoded floatDict object
2. THE Messages SHALL include all skin condition translations in the appropriate language files
3. THE PopularItems SHALL remove the hardcoded floatDict constant
4. THE PopularItems SHALL use consistent translation key patterns for skin conditions
5. THE PopularItems SHALL maintain the same skin condition text output as before migration

### Requirement 4: Maintain Existing Functionality

**User Story:** As a user, I want all existing popular items functionality to continue working, so that the migration doesn't break the component behavior.

#### Acceptance Criteria

1. WHEN the popular items section renders, THE PopularItems SHALL continue to display all existing skin items
2. WHEN skin items are clicked, THE PopularItems SHALL continue to navigate to marketplace with correct category filter
3. WHEN the "View All Items" button is clicked, THE PopularItems SHALL continue to navigate to the marketplace
4. THE PopularItems SHALL preserve all existing styling and animations
5. THE PopularItems SHALL maintain responsive behavior and hover effects
6. THE PopularItems SHALL continue to display skin images, prices, and conditions correctly

### Requirement 5: Remove Hardcoded Language Conditions

**User Story:** As a developer, I want to remove hardcoded language conditions from the popular items component, so that translations are handled consistently through next-intl.

#### Acceptance Criteria

1. WHEN displaying the section title, THE PopularItems SHALL use translation keys instead of language conditions
2. WHEN showing the "View All Items" button text, THE PopularItems SHALL use translation keys instead of manual language switching
3. THE PopularItems SHALL remove all instances of `language === 'uz' ? 'text' : language === 'ru' ? 'текст' : 'text'` patterns
4. THE PopularItems SHALL use consistent translation key patterns for all text elements

### Requirement 6: Proper TypeScript Integration

**User Story:** As a developer, I want proper TypeScript support for popular items translations, so that I have type safety and autocompletion.

#### Acceptance Criteria

1. WHEN using translations, THE PopularItems SHALL have proper TypeScript typing for translation keys
2. WHEN accessing nested translation objects, THE PopularItems SHALL maintain type safety
3. THE PopularItems SHALL use proper next-intl TypeScript patterns

### Requirement 7: Preserve Component Structure and Performance

**User Story:** As a user, I want the popular items component to maintain its performance and visual structure, so that the user experience remains optimal.

#### Acceptance Criteria

1. WHEN the component renders, THE PopularItems SHALL maintain the same visual layout and grid structure
2. WHEN animations trigger, THE PopularItems SHALL preserve all hover effects and transitions
3. THE PopularItems SHALL maintain the same component performance characteristics
4. THE PopularItems SHALL preserve the gradient text effects and styling
5. THE PopularItems SHALL maintain the card hover animations and transformations
