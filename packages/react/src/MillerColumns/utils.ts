import { Children, isValidElement, ReactElement, ReactNode } from "react";

import { MillerColumnsColumn } from "./MillerColumns";

/**
 * Produces the next active path when an item at `depth` with id `value`
 * is selected: keeps the columns shallower than `depth` untouched,
 * appends `value`, and drops everything deeper (those columns close).
 */
export function selectAtDepth(
  path: string[],
  depth: number,
  value: string,
): string[] {
  return [...path.slice(0, depth), value];
}

/**
 * Whether `node` is a `MillerColumns.Column` element — the identity
 * check used to separate an Item's cell content from its child column.
 */
export function isColumnElement(node: ReactNode): node is ReactElement {
  return isValidElement(node) && node.type === MillerColumnsColumn;
}

/**
 * Splits an `Item`'s children into its cell content and its single
 * optional nested `<MillerColumns.Column>`.
 */
export function partitionItemChildren(children: ReactNode): {
  cell: ReactNode[];
  column: ReactElement | null;
} {
  const cell: ReactNode[] = [];
  let column: ReactElement | null = null;

  for (const child of Children.toArray(children)) {
    if (isColumnElement(child)) {
      if (column !== null) {
        throw new Error(
          "A MillerColumns.Item may contain at most one nested <MillerColumns.Column>.",
        );
      }
      column = child;
    } else {
      cell.push(child);
    }
  }

  return { cell, column };
}
