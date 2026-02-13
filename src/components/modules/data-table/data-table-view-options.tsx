"use client";

import { Table, VisibilityState } from "@tanstack/react-table";
import { Settings2Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toTitleCase } from "@/lib/utils";

/**
 * Column meta interface for custom column labels
 */
interface ColumnMeta {
  /**
   * Custom label for the column in the view options dropdown
   */
  label?: string;
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  // Extract columnVisibility from table state for proper dependency tracking
  const columnVisibility = table.getState().columnVisibility;

  // Track visibility state locally to ensure re-renders when dropdown is open
  const [visibilityState, setVisibilityState] = React.useState<VisibilityState>(
    () => columnVisibility,
  );

  // Sync with table state - needed for external visibility changes (e.g., from column header)
  React.useEffect(() => {
    setVisibilityState(columnVisibility);
  }, [columnVisibility]);

  // Get all hideable columns
  const hideableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    );

  const handleVisibilityChange = (columnId: string, isVisible: boolean) => {
    // Update local state immediately for responsive UI
    setVisibilityState((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
    // Update the table
    const column = table.getColumn(columnId);
    column?.toggleVisibility(isVisible);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 gap-2 lg:flex"
        >
          <Settings2Icon className="size-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-37.5">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => {
          // Use local visibility state for proper reactivity
          // If not in state, column is visible by default
          const isVisible = visibilityState[column.id] !== false;

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={isVisible}
              onCheckedChange={(value) =>
                handleVisibilityChange(column.id, !!value)
              }
            >
              {getColumnDisplayLabel(column)}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Gets the display label for a column.
 * Priority: column.columnDef.meta.label > toTitleCase(column.id)
 */
function getColumnDisplayLabel<TData>(
  column: ReturnType<Table<TData>["getAllColumns"]>[number],
): string {
  const meta = column.columnDef.meta as ColumnMeta | undefined;
  if (meta?.label) {
    return meta.label;
  }
  return toTitleCase(column.id);
}
