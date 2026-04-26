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
| [Checkbox](src/Checkbox/README.md)        | WAI-ARIA Checkbox pattern — native `<button role="checkbox">` with tri-state (`"indeterminate"` / `aria-checked="mixed"`), controlled/uncontrolled state, `Indicator` slot, and `asChild` composition |
| [Collapsible](src/Collapsible/README.md)  | Single-panel show/hide — boolean controlled/uncontrolled state, `disabled`, `asChild` composition with explicit Enter/Space handling, `forceMount` for CSS-Grid-driven animation, and `TriggerIcon` slot |
| [Divider](src/Divider/README.md)          | WAI-ARIA separator role — horizontal or vertical content separator, with semantic and decorative use |
| [Dropdown](src/Dropdown/README.md)        | WAI-ARIA Menu Button / Menu pattern — native HTML `popover` compound component with nested submenus, checkbox and radio items, `ItemIndicator` icon slot, groups and labels, keyboard navigation, typeahead, disabled-item skipping, `onSelect` escape hatch, and `asChild` composition |
| [Modal](src/Modal/README.md)              | WAI-ARIA Modal Dialog pattern — native `<dialog>`-based compound component with Portal, bounding-rect click-outside, controlled/uncontrolled state, escape hatches, imperative API, `asChild`, and `forceMount` animation hooks |
| [RadioGroup](src/RadioGroup/README.md)    | WAI-ARIA Radio Group pattern — native `<button role="radio">` items with single-selection state, roving tabindex, arrow-key navigation, disabled-item skipping, `Indicator` slot, and `asChild` composition |
| [Table](src/Table/README.md)              | WAI-ARIA Table pattern — compound component wrapping standard HTML table elements with accessible headers, captions, and a responsive scroll wrapper |
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
