"use client";

import * as React from "react";

import { TableCell, TableRow } from "@/components/ui/table";

interface DataTableEmptyStateProps {
  /**
   * Number of columns to span
   */
  columnCount: number;
  /**
   * Custom empty state content
   */
  children?: React.ReactNode;
}

/**
 * Empty state display for the data table
 */
export function DataTableEmptyState({
  columnCount,
  children,
}: DataTableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="h-24 text-center">
        {children ?? "No results."}
      </TableCell>
    </TableRow>
  );
}
