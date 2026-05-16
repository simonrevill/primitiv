import { createPortal } from "react-dom";

import {
  MillerColumnsContext,
  MillerColumnsColumnContext,
  MillerColumnsItemContext,
} from "./MillerColumnsContext";
import {
  useMillerColumnsColumn,
  useMillerColumnsItem,
  useMillerColumnsItemContext,
  useMillerColumnsRoot,
} from "./hooks";

import { partitionItemChildren } from "./utils";

import type {
  MillerColumnsRootProps,
  MillerColumnsColumnProps,
  MillerColumnsItemProps,
  MillerColumnsItemIndicatorProps,
} from "./types";

/**
 * The root of a Miller Columns widget — a horizontal strip of vertical
 * lists where selecting a node reveals its children in the next column.
 *
 * Renders the strip container (`role="tree"`) into which every
 * `MillerColumns.Column` projects itself via a portal. Authoring the tree
 * is recursive: an `Item` declares its child column as a *nested*
 * `<MillerColumns.Column>`, and the strip flattens those nested columns
 * into a single left-to-right row.
 *
 * @example
 * ```tsx
 * <MillerColumns.Root>
 *   <MillerColumns.Column>
 *     <MillerColumns.Item value="docs">Docs</MillerColumns.Item>
 *   </MillerColumns.Column>
 * </MillerColumns.Root>
 * ```
 */
export function MillerColumnsRoot({
  children,
  defaultValue,
  value,
  onValueChange,
  ...rest
}: MillerColumnsRootProps) {
  const { contextValue } = useMillerColumnsRoot(
    value,
    defaultValue,
    onValueChange,
  );

  return (
    <MillerColumnsContext.Provider value={contextValue}>
      <div
        role="tree"
        data-miller-columns-strip=""
        data-orientation="horizontal"
        ref={contextValue.setStrip}
        {...rest}
      >
        {children}
      </div>
    </MillerColumnsContext.Provider>
  );
}

MillerColumnsRoot.displayName = "MillerColumnsRoot";

/**
 * A single vertical list of items within the strip. Renders a
 * `<div role="group">` that is portal-projected into the `Root` strip, so
 * a `Column` nested inside an `Item` still appears side-by-side with its
 * ancestors rather than in document flow.
 *
 * @example
 * ```tsx
 * <MillerColumns.Column>
 *   <MillerColumns.Item value="a">A</MillerColumns.Item>
 * </MillerColumns.Column>
 * ```
 */
export function MillerColumnsColumn({
  children,
  ...rest
}: MillerColumnsColumnProps) {
  const { strip, depth, columnContextValue } = useMillerColumnsColumn();

  if (!strip) {
    return null;
  }

  return createPortal(
    <MillerColumnsColumnContext.Provider value={columnContextValue}>
      <div
        role="group"
        data-miller-columns-column=""
        data-depth={depth}
        {...rest}
      >
        {children}
      </div>
    </MillerColumnsColumnContext.Provider>,
    strip,
  );
}

MillerColumnsColumn.displayName = "MillerColumnsColumn";

/**
 * A single selectable node within a `Column`. Renders a
 * `<div role="treeitem">` for its cell content.
 *
 * The {@link MillerColumnsItemProps.value | `value`} prop is the stable
 * identifier used to match this item against the active selection path.
 *
 * An `Item` becomes a branch by nesting a `<MillerColumns.Column>` among
 * its children. That child column is mounted (and projected into the
 * strip) only while the item is selected; an item with no nested column
 * is a leaf.
 *
 * @example Leaf
 * ```tsx
 * <MillerColumns.Item value="guides">Guides</MillerColumns.Item>
 * ```
 *
 * @example Branch
 * ```tsx
 * <MillerColumns.Item value="docs">
 *   Docs
 *   <MillerColumns.Column>
 *     <MillerColumns.Item value="guides">Guides</MillerColumns.Item>
 *   </MillerColumns.Column>
 * </MillerColumns.Item>
 * ```
 */
export function MillerColumnsItem({
  children,
  ...props
}: MillerColumnsItemProps) {
  const { cell, column } = partitionItemChildren(children);
  const { itemProps, selected, itemContextValue } = useMillerColumnsItem(
    props,
    column !== null,
  );

  return (
    <MillerColumnsItemContext.Provider value={itemContextValue}>
      <div {...itemProps}>{cell}</div>
      {selected ? column : null}
    </MillerColumnsItemContext.Provider>
  );
}

MillerColumnsItem.displayName = "MillerColumnsItem";

/**
 * An optional, decorative affordance for a branch item — typically a
 * chevron or arrow signalling "this item reveals a child column".
 *
 * Renders a `<span aria-hidden="true">` (so the glyph is ignored by
 * assistive technology) **only for branch items**; for a leaf item it
 * renders nothing. Place it among an `Item`'s cell content.
 *
 * **Styling hooks.**
 * - `data-state="selected" | "unselected"` — mirrors the parent item.
 * - `data-has-children` — always present (the indicator only renders
 *   for branch items).
 *
 * @example
 * ```tsx
 * <MillerColumns.Item value="docs">
 *   Docs
 *   <MillerColumns.ItemIndicator>▸</MillerColumns.ItemIndicator>
 *   <MillerColumns.Column>…</MillerColumns.Column>
 * </MillerColumns.Item>
 * ```
 */
export function MillerColumnsItemIndicator({
  children,
  ...rest
}: MillerColumnsItemIndicatorProps) {
  const { selected, hasChildren } = useMillerColumnsItemContext();

  if (!hasChildren) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      data-state={selected ? "selected" : "unselected"}
      data-has-children=""
      {...rest}
    >
      {children}
    </span>
  );
}

MillerColumnsItemIndicator.displayName = "MillerColumnsItemIndicator";

type MillerColumnsCompound = typeof MillerColumnsRoot & {
  Root: typeof MillerColumnsRoot;
  Column: typeof MillerColumnsColumn;
  Item: typeof MillerColumnsItem;
  ItemIndicator: typeof MillerColumnsItemIndicator;
};

const MillerColumnsCompound: MillerColumnsCompound = Object.assign(
  MillerColumnsRoot,
  {
    Root: MillerColumnsRoot,
    Column: MillerColumnsColumn,
    Item: MillerColumnsItem,
    ItemIndicator: MillerColumnsItemIndicator,
  },
);

MillerColumnsCompound.displayName = "MillerColumns";

export { MillerColumnsCompound as MillerColumns };
