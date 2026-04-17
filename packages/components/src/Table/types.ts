import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

type TableSubcomponentProps<T extends HTMLElement> = TableHTMLAttributes<T>;

/** Props for {@link Table.Root} — all `TableHTMLAttributes` on `<table>`. */
export type TableRootProps = TableSubcomponentProps<HTMLTableElement>;

/** Props for {@link Table.Head} — all `TableHTMLAttributes` on `<thead>`. */
export type TableHeadProps = TableSubcomponentProps<HTMLTableSectionElement>;

/** Props for {@link Table.Body} — all `TableHTMLAttributes` on `<tbody>`. */
export type TableBodyProps = TableSubcomponentProps<HTMLTableSectionElement>;

/** Props for {@link Table.Footer} — all `TableHTMLAttributes` on `<tfoot>`. */
export type TableFooterProps = TableSubcomponentProps<HTMLTableSectionElement>;

/** Props for {@link Table.Row} — all `TableHTMLAttributes` on `<tr>`. */
export type TableRowProps = TableSubcomponentProps<HTMLTableRowElement>;

/**
 * Props for {@link Table.Header} — all `ThHTMLAttributes` on `<th>`.
 *
 * The most important prop for accessibility is `scope`: set it to `"col"` for
 * column headers and `"row"` for row headers so assistive technology can
 * associate data cells with the correct header.
 */
export type TableHeaderProps = ThHTMLAttributes<HTMLTableCellElement>;

/**
 * Props for {@link Table.Cell} — all `TdHTMLAttributes` on `<td>`.
 *
 * Includes `colSpan` and `rowSpan` for spanning multiple columns or rows.
 */
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

/**
 * Props for {@link Table.ScrollArea} — `children` plus all `HTMLAttributes`
 * on the wrapping `<div>`.
 *
 * Any `style` properties you pass are merged with (and take priority over) the
 * base scroll styles (`display: block`, `overflow-x: auto`, `max-width: 100%`).
 */
export type TableScrollAreaProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for {@link Table.Caption} — `children`, an optional
 * `captionSide`, plus all `HTMLAttributes` on `<caption>`.
 */
export type TableCaptionProps = {
  children: ReactNode;
  /**
   * Controls the CSS `caption-side` property.
   * - `"bottom"` (default) — caption appears below the table.
   * - `"top"` — caption appears above the table.
   */
  captionSide?: "bottom" | "top";
} & HTMLAttributes<HTMLTableCaptionElement>;
