# Requirements Document

## Introduction

Add a LanguageSwitcher component to the main page's about section for switching between languages (uz, en, ru).

## Glossary

- **LanguageSwitcher**: Component for switching languages
- **About_Section**: Section on main page where switcher will be added

## Requirements

### Requirement 1: Create LanguageSwitcher Component

**User Story:** As a user, I want to switch languages on the website, so that I can view content in my preferred language.

#### Acceptance Criteria

1. THE LanguageSwitcher SHALL display all available locales (uz, en, ru) as clickable links
2. THE LanguageSwitcher SHALL highlight the currently active locale
3. WHEN a user clicks a language, THE system SHALL switch to that locale and preserve the current page
4. THE LanguageSwitcher SHALL use next-intl's Link and navigation hooks

### Requirement 2: Export Locales from Routing

**User Story:** As a developer, I want to access the locales array, so that the LanguageSwitcher can display available languages.

#### Acceptance Criteria

1. THE routing configuration SHALL export the locales array
2. THE LanguageSwitcher SHALL import locales from the routing file

### Requirement 3: Integrate into About Section

**User Story:** As a user, I want to see the language switcher in the about section, so that I can easily change languages.

#### Acceptance Criteria

1. THE LanguageSwitcher SHALL be added to the about section of the main page
2. THE LanguageSwitcher SHALL match the existing button styling
3. THE LanguageSwitcher SHALL be responsive and support dark/light themes
