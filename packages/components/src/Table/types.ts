import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

/** Props for {@link Table.Root} — all `TableHTMLAttributes` on `<table>`. */
export type TableRootProps = TableHTMLAttributes<HTMLTableElement>;

/** Props for {@link Table.Head} — all `HTMLAttributes` on `<thead>`. */
export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/** Props for {@link Table.Body} — all `HTMLAttributes` on `<tbody>`. */
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/** Props for {@link Table.Footer} — all `HTMLAttributes` on `<tfoot>`. */
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

/** Props for {@link Table.Row} — all `HTMLAttributes` on `<tr>`. */
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

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
