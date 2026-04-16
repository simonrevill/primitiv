# @primitiv/components

Headless, accessible React components built on the
[WAI-ARIA authoring patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
Zero styles ship with this package — style them with whatever system you use
(CSS, Tailwind, CSS-in-JS, design tokens, etc.).

## Installation

The package is part of the Primitiv monorepo. Within the workspace, import
directly:

```tsx
import { Tabs } from "@primitiv/components";
```

## Components

| Component                                 | Description                                             |
| ----------------------------------------- | ------------------------------------------------------- |
| [Accordion](src/Accordion/README.md)      | WAI-ARIA Accordion pattern — collapsible sections with keyboard navigation, controlled/uncontrolled state, multiple mode, and `asChild` composition |
| [Tabs](src/Tabs/README.md)                | WAI-ARIA Tabs pattern — compound component with keyboard navigation, controlled/uncontrolled state, and `asChild` composition |

## Internal utilities

**`Slot`** is the `asChild` composition utility used internally by components
such as `Tabs.Trigger`. It is not a public component API.

## Testing

Tests use [Vitest](https://vitest.dev/) and
[Testing Library](https://testing-library.com/).

```sh
# Run all component tests once
npx vitest run

# Watch mode
npx vitest

# With coverage
npx vitest run --coverage
```
