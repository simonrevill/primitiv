import {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableRootProps,
  TableRowProps,
  TableScrollAreaProps,
} from "./types";

function Table({ children, ...rest }: TableRootProps) {
  return <table {...rest}>{children}</table>;
}

Table.displayName = "Table";

function TableHead({ children, ...rest }: TableHeadProps) {
  return <thead {...rest}>{children}</thead>;
}

TableHead.displayName = "TableHead";

function TableBody({ children, ...rest }: TableBodyProps) {
  return <tbody {...rest}>{children}</tbody>;
}

TableBody.displayName = "TableBody";

function TableFooter({ children, ...rest }: TableFooterProps) {
  return <tfoot {...rest}>{children}</tfoot>;
}

TableFooter.displayName = "TableFooter";

function TableRow({ children, ...rest }: TableRowProps) {
  return <tr {...rest}>{children}</tr>;
}

TableRow.displayName = "TableRow";

function TableHeader({ children, ...rest }: TableHeaderProps) {
  return <th {...rest}>{children}</th>;
}

TableHeader.displayName = "TableHeader";

function TableCell({ children, ...rest }: TableCellProps) {
  return <td {...rest}>{children}</td>;
}

TableCell.displayName = "TableCell";

function TableScrollArea({ children, ...rest }: TableScrollAreaProps) {
  return (
    <div
      style={{
        display: "block",
        overflowX: "auto",
        maxWidth: "100%",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

TableScrollArea.displayName = "TableScrollArea";

function TableCaption({
  children,
  captionSide = "bottom",
  ...rest
}: TableCaptionProps) {
  return (
    <caption style={{ captionSide }} {...rest}>
      {children}
    </caption>
  );
}

TableCaption.displayName = "TableCaption";

type TableCompound = typeof Table & {
  Root: typeof Table;
  Head: typeof TableHead;
  Body: typeof TableBody;
  Footer: typeof TableFooter;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Cell: typeof TableCell;
  ScrollArea: typeof TableScrollArea;
  Caption: typeof TableCaption;
};

const TableCompound: TableCompound = Object.assign(Table, {
  Root: Table,
  Head: TableHead,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Header: TableHeader,
  Cell: TableCell,
  ScrollArea: TableScrollArea,
  Caption: TableCaption,
});

TableCompound.displayName = "Table";

export { TableCompound as Table };
