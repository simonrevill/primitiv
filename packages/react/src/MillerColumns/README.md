# MillerColumns

A compound component for the **Miller columns** pattern (also called
cascading lists or the macOS Finder "column view"): a horizontal strip
of vertical lists where selecting a node reveals its children in the
next column to the right.

```tsx
import { MillerColumns } from "@primitiv/react";

function Node({ node }) {
  return (
    <MillerColumns.Item value={node.id}>
      {node.label}
      {node.children?.length ? (
        <>
          <MillerColumns.ItemIndicator>▸</MillerColumns.ItemIndicator>
          <MillerColumns.Column>
            {node.children.map((child) => (
              <Node key={child.id} node={child} />
            ))}
          </MillerColumns.Column>
        </>
      ) : null}
    </MillerColumns.Item>
  );
}

<MillerColumns.Root defaultValue={["docs", "guides"]}>
  <MillerColumns.Column>
    {tree.map((node) => (
      <Node key={node.id} node={node} />
    ))}
  </MillerColumns.Column>
</MillerColumns.Root>;
```

## Authoring model

The tree is authored by **recursive composition** — there is no `data`
prop. An `Item` becomes a *branch* by nesting a
`<MillerColumns.Column>` among its children; that nested column lists
the item's children, each of which is another `Item`. An `Item` with no
nested column is a *leaf*.

Although child columns are authored nested, every `Column` is
**portal-projected** into the `Root` strip, so the active columns sit
side-by-side in a single left-to-right row regardless of how deeply
they were declared.

A branch's nested column is only **mounted while that branch is
selected**, so a consumer's recursive `Node` component naturally stops
recursing at inactive branches — only the columns along the active path
are ever rendered.

## Sub-components

| Export                       | Role          | Notes                                                                                          |
| ----------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `MillerColumns.Root`          | State owner   | Uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`); renders the strip     |
| `MillerColumns.Column`        | List          | A vertical list of items, projected into the strip as `role="group"`                           |
| `MillerColumns.Item`          | Tree node     | A `role="treeitem"`; branch when it nests a `Column`. Supports `disabled`, `asChild`, `ref`     |
| `MillerColumns.ItemIndicator` | Icon wrapper  | Decorative `aria-hidden` icon, rendered only for branch items                                  |

## Selection model

The selection is a single **active path** — an array of item ids from
the root column down to the deepest selected item. Selecting an item at
depth _d_ truncates the path to _d_ and appends the new id, so every
column deeper than _d_ closes.

- **Uncontrolled** — pass `defaultValue` (or omit it to start with
  nothing selected).
- **Controlled** — pass `value` and `onValueChange` together. The
  parent owns the path; the component defers every change back through
  the callback.

The two shapes are discriminated at the type level: passing
`defaultValue` alongside `value` is a type error.

There is no multi-select — only one path is active at a time.

## Keyboard interaction

| Key                 | Behaviour                                                              |
| ------------------- | ---------------------------------------------------------------------- |
| `ArrowUp` / `ArrowDown` | Move focus within the focused column (wraps, skips disabled items) |
| `Home` / `End`      | Focus the first / last item of the focused column                      |
| `Enter` / `Space`   | Select the focused item                                                |
| `ArrowRight`        | Branch: select it and move focus to its child column's first item; leaf: no-op |
| `ArrowLeft`         | Move focus to the selected item of the parent column                   |
| `Tab`               | Move into / out of the whole tree (single tabstop)                     |

The strip is a single roving-tabindex widget: exactly one item is
tabbable at a time. The tabstop follows the last-focused item and
defaults to the deepest selected item, falling back to the first item
of the root column.

## ARIA

- The strip is `role="tree"`.
- Each `Column` is `role="group"`.
- Each `Item` is `role="treeitem"` with `aria-level` (1-based column
  depth), `aria-selected`, and — on branch items — `aria-expanded`.

## Disabled items

Pass `disabled` on an `Item` to render `aria-disabled="true"` and
`data-disabled`, ignore clicks and activation keys, and skip the item
during arrow-key navigation. Disabled items remain in the DOM and
focusable for discovery.

## `asChild` composition

`MillerColumns.Item` accepts `asChild` to render the cell as a
consumer-supplied element instead of the default `<div>`. All treeitem
ARIA attributes, event handlers, and the internal ref are merged onto
the child (child handler runs first, then the component's). A nested
`<MillerColumns.Column>` is still declared as a sibling of the cell
element:

```tsx
<MillerColumns.Item<HTMLAnchorElement> asChild value="docs">
  <a href="#docs">Docs</a>
  <MillerColumns.Column>…</MillerColumns.Column>
</MillerColumns.Item>
```

A `ref` prop (React 19 ref-as-prop style) is forwarded to the rendered
element and composed with the library's internal ref.

## Styling hooks

Zero styles ship with the component. Style it through `data-*` hooks;
typically the strip is `display: flex` and each column scrolls
vertically.

```css
[data-miller-columns-strip] {
  display: flex;
}
[data-miller-columns-column] {
  overflow-y: auto;
}
[data-miller-columns-column][data-depth="0"] {
  /* the root column */
}
[role="treeitem"][data-state="selected"] {
  /* the selected item in each column */
}
[role="treeitem"][data-has-children] {
  /* branch items */
}
[role="treeitem"][data-disabled] {
  opacity: 0.5;
}
```

| Element         | Attributes                                                                  |
| --------------- | --------------------------------------------------------------------------- |
| Strip (`Root`)  | `data-miller-columns-strip`, `data-orientation="horizontal"`                |
| `Column`        | `data-miller-columns-column`, `data-depth`                                  |
| `Item`          | `data-state="selected" \| "unselected"`, `data-depth`, `data-has-children`, `data-disabled` |
| `ItemIndicator` | `data-state`, `data-has-children`                                           |

## Deferred / follow-up work

The following were intentionally left out of the first version and are
good candidates for later, independent cycles:

1. **Drag-to-resize columns.** A `ResizeHandle` sub-component, a
   pointer-drag hook, and per-column width state on `Root`.
2. **A `Preview` panel.** A batteries-included affordance for the
   macOS-style leaf-preview pane (for now, render any preview as
   ordinary children of a leaf `Item`).
3. **Horizontal auto-scroll.** Scrolling a newly revealed column into
   view within the strip.
4. **Context-menu image preview.** Once a Context Menu component
   exists, a leaf image `Item` could open a context menu on
   right-click whose first entry ("Preview", with an eye icon) opens
   the `Modal` to show the image larger.
