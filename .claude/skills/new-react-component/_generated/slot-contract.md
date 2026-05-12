# Slot / asChild contract

Lifted from `packages/react/src/Slot/Slot.tsx`. Reuse this primitive;
do not reimplement.

## Prop-merging rules

When `<Slot {...slotProps}>{childElement}</Slot>` clones the child,
the merge follows these rules:

- **Event handlers compose** — child's handler runs first, then
  Slot's. Pattern is `(...args) => { childVal(...args); slotVal(...args); }`.
- **`style`** is shallow-merged — child wins on key collisions.
- **`className`** strings are concatenated:
  `[slotVal, childVal].filter(Boolean).join(" ")`.
- All other props default to the child's value; Slot provides the
  fallback when the child doesn't specify one.
- Refs from both sides are composed via `composeRefs`.

## Constraints

- Exactly one React element child. Slot throws otherwise:
  `"Slot requires exactly one React element child."`
- The child must accept a `ref` (i.e. a DOM element or a `forwardRef`
  component).

## React-version compatibility

Slot reads the child's ref from `element.props.ref` (React 19+)
with a fallback to `element.ref` (React ≤18) so both runtime
versions compose refs correctly.

## Use inside a sub-component

```tsx
if (asChild) {
  return <Slot {...buttonProps}>{children}</Slot>;
}
return <button {...buttonProps}>{children}</button>;
```

`buttonProps` should include the full set of behaviour-bearing props
(event handlers, ARIA attributes, ref). Slot will merge them onto
the consumer's element following the rules above.

## When to expose `asChild`

A sub-component should accept `asChild` when:

- Consumers may legitimately want to render it as something other
  than the default element (e.g. a Trigger as `<Link>` from a
  router instead of `<button>`).
- The ARIA / event contract is preserved by the substitute element.

A sub-component should NOT accept `asChild` when:

- The default element type is semantically required and substitutes
  would break accessibility (e.g. the actual focus target in a
  roving-tabindex compound).
- Multiple children are required (Slot rejects more than one).
