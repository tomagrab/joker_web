"use client";

import { Table } from "@tanstack/react-table";
import { SearchIcon, XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface DataTableGlobalFilterProps<TData> {
  /**
   * The table instance
   */
  table: Table<TData>;
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Callback when filter value changes
   */
  onValueChange?: (value: string) => void;
}

/**
 * Global filter input component with search icon and debouncing.
 *
 * Provides a search input that filters across all columns using
 * the table's globalFilterFn (supports fuzzy filtering).
 *
 * @example
 * ```tsx
 * <DataTableGlobalFilter
 *   table={table}
 *   placeholder="Search all columns..."
 *   debounceMs={300}
 * />
 * ```
 */
export function DataTableGlobalFilter<TData>({
  table,
  placeholder = "Search...",
  debounceMs = 300,
  className,
  onValueChange,
}: DataTableGlobalFilterProps<TData>) {
  // Local state for immediate input feedback
  const globalFilterValue = (table.getState().globalFilter as string) ?? "";
  const [value, setValue] = React.useState<string>(globalFilterValue);

  // Sync local state with table state when it changes externally
  React.useEffect(() => {
    setValue(globalFilterValue);
  }, [globalFilterValue]);

  // Debounce the global filter update
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(value);
      onValueChange?.(value);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, debounceMs, table, onValueChange]);

  const handleClear = () => {
    setValue("");
    table.setGlobalFilter("");
    onValueChange?.("");
  };

  return (
    <InputGroup className={cn("h-8 w-37.5 lg:w-62.5", className)}>
      <InputGroupAddon align="inline-start">
        <SearchIcon className="size-4" />
      </InputGroupAddon>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-full border-0 shadow-none focus-visible:ring-0"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <Button
            variant="ghost"
            size="icon"
            className="size-5 rounded-full"
            onClick={handleClear}
          >
            <XIcon className="size-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
