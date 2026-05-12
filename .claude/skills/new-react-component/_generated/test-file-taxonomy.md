# Test-file taxonomy

Distinct suffixes observed across `packages/react/src/*/__tests__/`.
Use one of these when naming a new test file; only invent a new
suffix when none of these fit.

## Recurring (used by multiple components)

| Suffix | Used by | Covers |
|---|---|---|
| `basic-rendering` | most | ARIA roles, data-* hooks, DOM shape, presence of expected elements |
| `controlled-state` | most compound | `value` + `onValueChange` contract; externally driven |
| `uncontrolled-state` | most compound | `defaultValue` + internal state; no-default edge cases |
| `error-handling` | most compound | invalid props throw clear errors; dynamic-removal of registered items |
| `asChild` | every asChild-capable component | Slot composition, ref forwarding, event composition |
| `keyboard-interaction` | Accordion, Dropdown, RadioGroup, Tabs | Arrow/Home/End/Enter/Space, focus movement |
| `mouse-interaction` | Accordion, Dropdown, Tabs | click activation, hover-driven behaviour |
| `disabled` | Checkbox, Collapsible, Dropdown, RadioGroup | disabled state, focusability, keydown guards |
| `disabled-<things>` | Accordion (items), Tabs (tabs), RadioGroup (keydown-guards) | component-specific disabled variants |
| `reading-direction` | Accordion, Tabs | RTL arrow-key inversion |
| `indicator` / `indicators` | Carousel, Checkbox, RadioGroup, Dropdown | indicator child rendering and state sync |
| `imperative-api` | Carousel, Modal, Tabs | `ref` exposes setters; `setActiveTab(value)` etc. |
| `forceMount` / `lazy-mount` | Accordion, Collapsible (forceMount); Tabs (lazy-mount) | content presence policy |

## Component-specific (used by exactly one component)

The catalogue: `activation-mode`, `change-event-callbacks`,
`data-attributes`, `multiple-mode`, `ids`, `ref-forwarding`,
`roving-tabindex`, `icon-usage`, `triggerIcon`, `indeterminate`,
`accessibility`, `auto-play`, `play-pause`, `click-outside`,
`escape-hatches`, `nested`, `overlay`, `portal`, `presence`,
`content`, `trigger`, `sub`, `checkbox-item`, `radio-item`, `item`,
`item-indicator`, `group-label`, `separator`, `typeahead`,
`intersection-observer`, `scroll-snap-change`, `scroll-sync`,
`loop-animation`, `refresh-progress`, `transition-modes`,
`reduced-motion`, `slides-per-move`, `slides-per-page`,
`touch-interaction`, `translations`, `prev-next`,
`keyboard-edge-cases`, `keyboard-navigation`, `state-modes`.

Component-specific suffixes are fine when the behaviour genuinely
doesn't fit a recurring bucket. Don't force-fit.

## Fixture files

`<Component>.fixtures.ts` — pure data, no `it`/`describe`, no render
helpers. Exported as constant arrays for `describe.each`.

```ts
export const arrowKeyCases = [
  { key: "{ArrowRight}", from: "tab1", expected: "tab2" },
  // ...
] as const;
```
