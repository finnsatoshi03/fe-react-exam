import React from "react";

type TableVariant = "default" | "striped" | "bordered";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: TableVariant;
  children: React.ReactNode;
}

interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  children: React.ReactNode;
}

interface TableBodyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  children: React.ReactNode;
}

interface TableRowProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  children: React.ReactNode;
}

interface TableHeaderCellProps
  extends React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  > {
  children: React.ReactNode;
}

interface TableCellProps
  extends React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {
  children: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles: Record<TableVariant, string> = {
      default: "w-full",
      striped: "w-full",
      bordered: "w-full border-collapse border border-gray-200",
    };

    return (
      <table
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </table>
    );
  },
);

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  ),
);

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  ),
);

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    const baseStyles = "hover:bg-gray-100 transition-colors duration-200";
    return (
      <tr ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </tr>
    );
  },
);

const TableHeaderCell = React.forwardRef<
  HTMLTableHeaderCellElement,
  TableHeaderCellProps
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={`px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase ${className}`}
    {...props}
  >
    {children}
  </th>
));

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={`px-4 py-3 text-sm ${className}`} {...props}>
      {children}
    </td>
  ),
);

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow";
TableHeaderCell.displayName = "TableHeaderCell";
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell };
