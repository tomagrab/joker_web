"use client";

import { Cell, flexRender } from "@tanstack/react-table";

import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableBodyCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
  getLeftPinOffset: (columnId: string) => number;
  getRightPinOffset: (columnId: string) => number;
}

export function DataTableBodyCell<TData, TValue>({
  cell,
  getLeftPinOffset,
  getRightPinOffset,
}: DataTableBodyCellProps<TData, TValue>) {
  const isPinned = cell.column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && cell.column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && cell.column.getIsFirstColumn("right");

  return (
    <TableCell
      className={cn(
        isPinned && "bg-background sticky z-10",
        isLastLeftPinned &&
          "after:bg-border after:absolute after:top-0 after:right-0 after:bottom-0 after:w-px",
        isFirstRightPinned &&
          "before:bg-border before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px",
      )}
      style={
        isPinned
          ? {
              left:
                isPinned === "left"
                  ? `${getLeftPinOffset(cell.column.id)}px`
                  : undefined,
              right:
                isPinned === "right"
                  ? `${getRightPinOffset(cell.column.id)}px`
                  : undefined,
            }
          : undefined
      }
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
