# Shared hooks (`packages/react/src/hooks/`)

These are the library-wide hooks every compound component reaches
for. Don't re-roll any of them. Full JSDoc lives in the source.

| Hook | File | What it does |
|---|---|---|
| `useControllableState<T>` | `useControllableState.ts` | Manages the `controlled` / `defaultValue` / `onChange` pair. Returns `[value, setValue, isControlled]`. The setter notifies `onChange` in both modes and does NOT dedupe — callers must add a "did it actually change?" guard at the call site if needed. |
| `useCollection<K, V>` | `useCollection.ts` | Tracks a registry of mounted child elements / per-key values. Returns `{ register(key, value \| null), itemsRef, keys }`. `keys` is React state (triggers re-render on mount/unmount); `itemsRef.current` is a live Map for imperative reads inside event handlers. Option: `updateKeysOnCleanup: false` for collections that may unmount after a render-time throw (Accordion's trigger validation). |
| `useRovingTabindex<K>` | `useRovingTabindex.ts` | Maps keypresses (Arrow/Home/End/Enter/Space) to abstract actions (`next \| prev \| first \| last \| activate`) and delegates to `onNavigate`. Caller filters `navigable` to control disabled-handling. `orientation: "both"` for RadioGroup-style no-RTL all-arrows. `includeHomeEnd` and `includeActivate` are opt-in. |
