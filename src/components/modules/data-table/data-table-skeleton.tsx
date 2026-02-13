"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface DataTableSkeletonRowsProps {
  /**
   * Number of rows to display
   */
  rowCount: number;
  /**
   * Number of columns to display
   */
  columnCount: number;
}

/**
 * Skeleton loading rows for the data table
 */
export function DataTableSkeletonRows({
  rowCount,
  columnCount,
}: DataTableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
