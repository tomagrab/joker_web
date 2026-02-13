"use client";

import { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { DataTableGlobalFilter } from "./data-table-global-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /**
   * Enable global filtering (search across all columns)
   * @default false
   */
  enableGlobalFilter?: boolean;
  /**
   * Placeholder text for global filter input
   */
  globalFilterPlaceholder?: string;
  /**
   * Debounce delay for global filter in milliseconds
   * @default 300
   */
  globalFilterDebounceMs?: number;
  /**
   * Custom content to render on the left side of the toolbar (after filter)
   * Ideal for faceted filters
   */
  leftContent?: React.ReactNode;
  /**
   * Custom content to render on the right side of the toolbar (before view options)
   */
  rightContent?: React.ReactNode;
  /**
   * Whether to show the view options dropdown (default: true)
   */
  showViewOptions?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  enableGlobalFilter = false,
  globalFilterPlaceholder = "Search...",
  globalFilterDebounceMs = 300,
  leftContent,
  rightContent,
  showViewOptions = true,
}: DataTableToolbarProps<TData>) {
  const isColumnFiltered = table.getState().columnFilters.length > 0;
  const isGlobalFiltered = Boolean(table.getState().globalFilter);
  const isFiltered = isColumnFiltered || isGlobalFiltered;

  const handleResetFilters = () => {
    table.resetColumnFilters();
    if (enableGlobalFilter) {
      table.setGlobalFilter("");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Global Filter */}
        {enableGlobalFilter && (
          <DataTableGlobalFilter
            table={table}
            placeholder={globalFilterPlaceholder}
            debounceMs={globalFilterDebounceMs}
          />
        )}
        {/* Left Content (typically faceted filters) */}
        {leftContent}
        {/* Reset Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-8 gap-2 px-2 lg:px-3"
          >
            Reset
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
