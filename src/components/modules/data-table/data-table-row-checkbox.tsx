"use client";

import { Row, Table } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

interface DataTableSelectAllCheckboxProps<TData> {
  /**
   * The table instance
   */
  table: Table<TData>;
}

/**
 * Checkbox for selecting all rows on the current page.
 * Uses TanStack Table's built-in APIs for selection state.
 */
export function DataTableSelectAllCheckbox<TData>({
  table,
}: DataTableSelectAllCheckboxProps<TData>) {
  const isAllSelected = table.getIsAllPageRowsSelected();
  const isSomeSelected = table.getIsSomePageRowsSelected();

  return (
    <Checkbox
      checked={isAllSelected || (isSomeSelected && "indeterminate")}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

interface DataTableRowCheckboxProps<TData> {
  /**
   * The row instance
   */
  row: Row<TData>;
}

/**
 * Checkbox for selecting an individual row.
 * Uses TanStack Table's built-in APIs for selection state.
 * Respects `enableRowSelection` configuration - disabled when row cannot be selected.
 */
export function DataTableRowCheckbox<TData>({
  row,
}: DataTableRowCheckboxProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}
