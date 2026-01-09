# Design Document: PopularItems Next-intl Migration

## Overview

This design outlines the migration of the PopularItems.tsx component from custom translation logic to next-intl. The migration will replace manual language switching with next-intl's useTranslations hook, move hardcoded translations to JSON message files, and maintain all existing functionality while improving maintainability and consistency with the project's internationalization approach.

## Architecture

The migration follows a straightforward refactoring approach:

1. **Translation Hook Integration**: Replace custom translation logic with next-intl's useTranslations hook
2. **Message File Updates**: Move all hardcoded translations to the existing messages JSON structure
3. **Code Cleanup**: Remove custom translation imports and language switching logic
4. **Functionality Preservation**: Maintain all existing component behavior and styling

## Components and Interfaces

### PopularItems Component Changes

**Current Structure:**

```typescript
// Current imports
import { translations } from "@/lib/translations";
import { useSettingsStore } from "@/store/settingsStore";

// Current translation logic
const { language } = useSettingsStore();
const t = translations[language];
const tFloat = (floatKey: string) =>
  floatDict[floatKey]?.[language] || floatKey;
```

**New Structure:**

```typescript
// New imports
import { useTranslations } from "next-intl";

// New translation logic
const t = useTranslations("PopularItems");
```

### Translation Key Structure

The component will use the following translation key hierarchy:

```typescript
PopularItems: {
  title: string;
  startFrom: string;
  viewAllItems: string;
  skinConditions: {
    factoryNew: string;
    minimalWear: string;
    fieldTested: string;
    wellWorn: string;
    battleScarred: string;
  }
}
```

## Data Models

### Message File Structure

Each language file (uz.json, en.json, ru.json) will be extended with:

```json
{
  "PopularItems": {
    "title": "POPULAR ITEMS",
    "startFrom": "Start from:",
    "viewAllItems": "View All Items",
    "skinConditions": {
      "factoryNew": "Factory New",
      "minimalWear": "Minimal Wear",
      "fieldTested": "Field-Tested",
      "wellWorn": "Well-Worn",
      "battleScarred": "Battle-Scarred"
    }
  }
}
```

### Skin Condition Mapping

The current floatDict will be replaced with translation keys:

```typescript
// Current approach
const floatDict: Record<string, { uz: string; ru: string; en: string }> = {
  "Factory New": {
    uz: "Zavoddan yangi",
    ru: "Прямо с завода",
    en: "Factory New",
  },
  // ... other conditions
};

// New approach
const getConditionTranslation = (condition: string) => {
  const conditionMap: Record<string, string> = {
    "Factory New": "factoryNew",
    "Minimal Wear": "minimalWear",
    "Field-Tested": "fieldTested",
    "Well-Worn": "wellWorn",
    "Battle-Scarred": "battleScarred",
  };
  return t(`skinConditions.${conditionMap[condition]}`) || condition;
};
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Now I need to use the prework tool to analyze the acceptance criteria before writing the correctness properties:

Based on the prework analysis, I'll focus on the testable properties while noting that visual and styling aspects will be verified through manual testing:

### Property 1: Translation Hook Usage

_For any_ text content displayed in the PopularItems component, all translations should be accessed through the next-intl useTranslations hook rather than custom translation objects
**Validates: Requirements 1.2**

### Property 2: Message File Completeness

_For any_ text content displayed in the component, there should be corresponding translation keys in all three language message files (uz.json, en.json, ru.json)
**Validates: Requirements 2.1**

### Property 3: Skin Condition Translation Consistency

_For any_ skin condition displayed in the component, the translation should be retrieved from message files rather than the hardcoded floatDict object
**Validates: Requirements 3.1**

### Property 4: Message Structure Consistency

_For any_ translation key defined in one language file, the same key structure should exist in all other language files
**Validates: Requirements 2.5**

### Property 5: Translation Key Pattern Consistency

_For any_ translation key used in the component, it should follow consistent naming patterns (camelCase for nested keys)
**Validates: Requirements 3.4, 5.4**

### Property 6: Skin Condition Text Preservation

_For any_ skin condition, the translated text output should match the original text that was displayed before migration
**Validates: Requirements 3.5**

### Property 7: Component Data Display Preservation

_For any_ skin item data (name, price, condition), the display format and content should remain identical to the pre-migration version
**Validates: Requirements 4.1, 4.6**

### Property 8: Navigation Behavior Preservation

_For any_ clickable element in the component, the navigation behavior should remain identical to the pre-migration version
**Validates: Requirements 4.2**

## Error Handling

The migration maintains the existing error handling approach:

1. **Missing Translation Keys**: If a translation key is missing, next-intl will fall back to the key name, preventing runtime errors
2. **Invalid Skin Conditions**: The condition mapping function includes fallback to the original condition string
3. **Navigation Errors**: Existing router error handling is preserved

## Testing Strategy

### Unit Tests

- Verify component renders without errors after migration
- Test that all expected text content is displayed
- Verify navigation functions work correctly
- Test skin condition mapping functionality
- Verify message file structure and completeness

### Property-Based Tests

- **Property 1**: Test translation hook usage across all text content
- **Property 2**: Test message file completeness for all displayed content
- **Property 3**: Test skin condition translation consistency
- **Property 4**: Test message structure consistency across language files
- **Property 5**: Test translation key pattern consistency
- **Property 6**: Test skin condition text preservation (round-trip)
- **Property 7**: Test component data display preservation
- **Property 8**: Test navigation behavior preservation

### Manual Testing

- Visual verification of styling and animations
- Responsive behavior testing
- Hover effects and transitions verification
- Cross-browser compatibility testing

### Integration Tests

- Test component integration with next-intl locale switching
- Verify proper rendering in different language contexts
- Test component behavior within the larger application context

The testing approach balances automated verification of functional requirements with manual verification of visual and interactive elements that are difficult to test programmatically.
