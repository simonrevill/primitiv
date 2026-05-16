import { createPortal } from "react-dom";

import {
  MillerColumnsContext,
  MillerColumnsColumnContext,
} from "./MillerColumnsContext";
import { useMillerColumnsColumn, useMillerColumnsRoot } from "./hooks";
import { useMillerColumnsColumnContext } from "./hooks/useMillerColumnsColumnContext";

import type {
  MillerColumnsRootProps,
  MillerColumnsColumnProps,
  MillerColumnsItemProps,
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
  ...rest
}: MillerColumnsRootProps) {
  const { contextValue } = useMillerColumnsRoot();

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
  const { strip, columnContextValue } = useMillerColumnsColumn();

  if (!strip) {
    return null;
  }

  return createPortal(
    <MillerColumnsColumnContext.Provider value={columnContextValue}>
      <div role="group" {...rest}>
        {children}
      </div>
    </MillerColumnsColumnContext.Provider>,
    strip,
  );
}

MillerColumnsColumn.displayName = "MillerColumnsColumn";

/**
 * A single selectable node within a `Column`. Renders a
 * `<div role="treeitem">`.
 *
 * The {@link MillerColumnsItemProps.value | `value`} prop is the stable
 * identifier used to match this item against the active selection path.
 *
 * @example
 * ```tsx
 * <MillerColumns.Item value="guides">Guides</MillerColumns.Item>
 * ```
 */
export function MillerColumnsItem({
  children,
  value,
  ...rest
}: MillerColumnsItemProps) {
  useMillerColumnsColumnContext();

  return (
    <div role="treeitem" {...rest}>
      {children}
    </div>
  );
}

MillerColumnsItem.displayName = "MillerColumnsItem";

type MillerColumnsCompound = typeof MillerColumnsRoot & {
  Root: typeof MillerColumnsRoot;
  Column: typeof MillerColumnsColumn;
  Item: typeof MillerColumnsItem;
};

const MillerColumnsCompound: MillerColumnsCompound = Object.assign(
  MillerColumnsRoot,
  {
    Root: MillerColumnsRoot,
    Column: MillerColumnsColumn,
    Item: MillerColumnsItem,
  },
);

MillerColumnsCompound.displayName = "MillerColumns";

export { MillerColumnsCompound as MillerColumns };
