# Design Document

## Overview

This design implements a LanguageSwitcher component that integrates with next-intl for locale switching. The component will be added to the about section of the main page, providing users with an intuitive way to switch between Uzbek, English, and Russian languages.

## Architecture

The solution consists of three main parts:

1. **Routing Configuration Update**: Export the locales array from the existing routing configuration
2. **LanguageSwitcher Component**: A reusable React component for language switching
3. **Page Integration**: Adding the component to the about section of the main page

## Components and Interfaces

### LanguageSwitcher Component

**Location**: `src/components/LanguageSwitcher.tsx`

**Props Interface**:

```typescript
interface LanguageSwitcherProps {
  className?: string; // Optional additional CSS classes
}
```

**Key Features**:

- Uses next-intl's `Link`, `usePathname`, and `useLocale` hooks
- Imports locales array from routing configuration
- Renders clickable language options with proper styling
- Highlights the currently active locale

### Routing Configuration Update

**Location**: `src/i18n/routing.ts`

**Export Addition**:

```typescript
export const locales = routing.locales;
```

This allows other components to access the available locales without duplicating the configuration.

## Data Models

### Locale Type

```typescript
type Locale = "uz" | "en" | "ru";
```

### Component State

The component relies on next-intl's built-in state management:

- Current locale from `useLocale()`
- Current pathname from `usePathname()`
- Navigation through next-intl's `Link` component

## Error Handling

**Locale Validation**: The component assumes valid locales from the routing configuration. No additional validation needed since next-intl handles invalid locales.

**Navigation Errors**: next-intl's Link component handles navigation errors internally.

## Testing Strategy

### Unit Tests

- Test component renders all available locales
- Test active locale highlighting
- Test proper Link generation with correct href and locale props

### Integration Tests

- Test component integration with next-intl routing
- Test locale switching preserves current page path
- Test component rendering in different language contexts

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Locale Display Completeness

_For any_ set of available locales, the LanguageSwitcher should render exactly one clickable link for each locale with the correct locale value
**Validates: Requirements 1.1**

### Property 2: Active Locale Highlighting

_For any_ current locale, the LanguageSwitcher should apply active styling only to the link corresponding to that locale
**Validates: Requirements 1.2**

### Property 3: Navigation Link Generation

_For any_ locale and current pathname, clicking a language link should generate the correct href that preserves the pathname while switching to the target locale
**Validates: Requirements 1.3**

### Property 4: Consistent Button Styling

_For any_ rendered language link, the component should apply CSS classes that match the existing button styling patterns used throughout the application
**Validates: Requirements 3.2**

### Property 5: Theme Support

_For any_ theme context (light or dark), the LanguageSwitcher should render with appropriate theme-aware styling
**Validates: Requirements 3.3**
