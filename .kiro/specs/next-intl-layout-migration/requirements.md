# Requirements Document

## Introduction

Migrate the existing layout.tsx file from using a custom LanguageProvider to next-intl, which is already configured in the project. The migration should maintain all existing functionality while leveraging next-intl's built-in internationalization features.

## Glossary

- **Layout**: The root layout component that wraps all pages in the Next.js application
- **next-intl**: The internationalization library already configured in the project
- **LanguageProvider**: The custom context provider currently being used for language management
- **Locale**: The language/region identifier (uz, en, ru)
- **Hydration**: The process of rehydrating client-side stores after server-side rendering

## Requirements

### Requirement 1: Replace Custom Language Provider

**User Story:** As a developer, I want to use next-intl instead of the custom LanguageProvider, so that I can leverage standardized internationalization features.

#### Acceptance Criteria

1. WHEN the layout component renders, THE Layout SHALL use next-intl's NextIntlClientProvider instead of the custom LanguageProvider
2. WHEN the layout receives locale parameter, THE Layout SHALL pass the locale to next-intl provider
3. WHEN messages are needed, THE Layout SHALL load messages using next-intl's message loading mechanism
4. THE Layout SHALL remove the custom LanguageProvider import and usage

### Requirement 2: Maintain Existing Functionality

**User Story:** As a user, I want all existing functionality to continue working, so that the migration doesn't break the application.

#### Acceptance Criteria

1. WHEN the layout renders, THE Layout SHALL continue to apply theme settings correctly
2. WHEN stores are rehydrated, THE Layout SHALL maintain the existing rehydration logic
3. WHEN the application loads, THE Layout SHALL continue to fetch exchange rates
4. THE Layout SHALL preserve all existing useEffect logic and functionality

### Requirement 3: Proper Locale Handling

**User Story:** As a user, I want the application to use the correct locale, so that content appears in the right language.

#### Acceptance Criteria

1. WHEN a locale parameter is provided, THE Layout SHALL use that locale for next-intl
2. WHEN the html element is rendered, THE Layout SHALL set the lang attribute to the current locale
3. THE Layout SHALL ensure proper TypeScript typing for the locale parameter

### Requirement 4: Server-Side Compatibility

**User Story:** As a developer, I want the layout to work with Next.js server-side rendering, so that the application renders correctly.

#### Acceptance Criteria

1. THE Layout SHALL maintain client-side rendering with "use client" directive
2. WHEN messages are loaded, THE Layout SHALL handle them appropriately for client-side usage
3. THE Layout SHALL maintain suppressHydrationWarning for theme application
