import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

type TableSubcomponentProps<T extends HTMLElement> = TableHTMLAttributes<T>;

export type TableRootProps = TableSubcomponentProps<HTMLTableElement>;
export type TableHeadProps = TableSubcomponentProps<HTMLTableSectionElement>;
export type TableBodyProps = TableSubcomponentProps<HTMLTableSectionElement>;
export type TableFooterProps = TableSubcomponentProps<HTMLTableSectionElement>;
export type TableRowProps = TableSubcomponentProps<HTMLTableRowElement>;
export type TableHeaderProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;
export type TableScrollAreaProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;
export type TableCaptionProps = {
  children: ReactNode;
  captionSide?: "bottom" | "top";
} & HTMLAttributes<HTMLTableCaptionElement>;
