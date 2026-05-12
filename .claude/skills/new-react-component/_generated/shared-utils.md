# Shared utilities (`packages/react/src/utils/`)

| Utility | File | What it does |
|---|---|---|
| `createStrictContext<T>(errorMessage, displayName?)` | `createStrictContext.ts` | Creates a React context paired with a strict consumer hook that throws a clear error when a sub-component is rendered outside its provider. Returns `[Context, useStrictContext]`. Every compound component's `<Component>Context.ts` uses this. |
| `deriveId(rootId, suffix, value)` | `deriveId.ts` | Builds a deterministic sub-id from a stable root id (from `useId()`), a fixed role suffix (e.g. `"trigger"`, `"panel"`, `"heading"`), and a per-item discriminator. Used to wire `aria-controls` / `aria-labelledby` between paired sub-components. Returns `` `${rootId}-${suffix}-${value}` `` — don't construct that template yourself. |
| `getKeyToActionMap` | `getKeyToActionMap.ts` | Builds the keyboard-key → `RovingKeyAction` map for one focusable item in a roving-tabindex pattern. Options: `orientation` (`horizontal`/`vertical`/`both`), `dir` (LTR/RTL, horizontal only), `homeEnd` (opt-in Home/End), `activate` (opt-in Enter/Space). Used internally by `useRovingTabindex`; reach for it directly if you need the keymap without the dispatcher. |

# Slot exports (`packages/react/src/Slot/`)

| Export | File | What it does |
|---|---|---|
| `Slot` | `Slot.tsx` | The asChild composition primitive. See `slot-contract.md` for the merge rules. |
| `composeRefs` | `Slot.tsx` | Combines multiple refs (function or object refs, or `undefined`) into a single callback ref. Used inside Slot and any sub-component that needs to compose an internal ref with a consumer-supplied external ref. |
| `composeEventHandlers` | `composeEventHandlers.ts` | Returns a wrapper that runs the consumer-supplied handler first, then the component's own handler — unless the consumer called `event.preventDefault()`, in which case the library handler is skipped. Standard composition pattern for letting consumers veto a component's behaviour. |
