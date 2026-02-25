"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import * as React from "react";

interface UseFilteringOptions {
  /**
   * Initial global filter value
   */
  initialGlobalFilter?: string;
  /**
   * Initial column filters state
   */
  initialColumnFilters?: ColumnFiltersState;
  /**
   * Debounce delay for global filter changes (ms)
   * @default 300
   */
  debounceMs?: number;
  /**
   * Callback when global filter changes (after debounce)
   */
  onGlobalFilterChange?: (value: string) => void;
  /**
   * Callback when column filters change
   */
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
}

interface UseFilteringReturn {
  /**
   * Current global filter value (debounced)
   */
  globalFilter: string;
  /**
   * Set global filter value
   */
  setGlobalFilter: (value: string) => void;
  /**
   * Immediate global filter value (for input binding)
   */
  globalFilterInput: string;
  /**
   * Set immediate global filter input value
   */
  setGlobalFilterInput: (value: string) => void;
  /**
   * Current column filters state
   */
  columnFilters: ColumnFiltersState;
  /**
   * Set column filters state
   */
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  /**
   * Check if any filters are active
   */
  isFiltered: boolean;
  /**
   * Reset all filters
   */
  resetFilters: () => void;
  /**
   * Reset global filter only
   */
  resetGlobalFilter: () => void;
  /**
   * Reset column filters only
   */
  resetColumnFilters: () => void;
  /**
   * Get filter value for a specific column
   */
  getColumnFilterValue: <T = unknown>(columnId: string) => T | undefined;
  /**
   * Set filter value for a specific column
   */
  setColumnFilterValue: <T = unknown>(columnId: string, value: T) => void;
}

/**
 * Hook for managing data table filtering state with debouncing support.
 *
 * Provides unified management of both global and column filters with
 * optimized input handling through debouncing.
 *
 * @example
 * ```tsx
 * const {
 *   globalFilter,
 *   setGlobalFilter,
 *   globalFilterInput,
 *   setGlobalFilterInput,
 *   columnFilters,
 *   setColumnFilters,
 *   isFiltered,
 *   resetFilters,
 * } = useFiltering({
 *   debounceMs: 300,
 *   onGlobalFilterChange: (value) => console.log("Filter:", value),
 * });
 *
 * // Use in table options:
 * const table = useReactTable({
 *   state: { globalFilter, columnFilters },
 *   onGlobalFilterChange: setGlobalFilter,
 *   onColumnFiltersChange: setColumnFilters,
 * });
 * ```
 */
export function useFiltering({
  initialGlobalFilter = "",
  initialColumnFilters = [],
  debounceMs = 300,
  onGlobalFilterChange,
  onColumnFiltersChange,
}: UseFilteringOptions = {}): UseFilteringReturn {
  // Global filter state (debounced value used by table)
  const [globalFilter, setGlobalFilterState] =
    React.useState(initialGlobalFilter);
  // Immediate input value for responsive UI
  const [globalFilterInput, setGlobalFilterInput] =
    React.useState(initialGlobalFilter);

  // Column filters state
  const [columnFilters, setColumnFiltersState] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  // Debounce global filter updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilterState(globalFilterInput);
      onGlobalFilterChange?.(globalFilterInput);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [globalFilterInput, debounceMs, onGlobalFilterChange]);

  // Notify parent of column filter changes
  React.useEffect(() => {
    onColumnFiltersChange?.(columnFilters);
  }, [columnFilters, onColumnFiltersChange]);

  // Direct setter for global filter (bypasses debounce)
  const setGlobalFilter = React.useCallback((value: string) => {
    setGlobalFilterInput(value);
    setGlobalFilterState(value);
  }, []);

  // Custom column filters setter with callback support
  const setColumnFilters = React.useCallback(
    (action: React.SetStateAction<ColumnFiltersState>) => {
      setColumnFiltersState(action);
    },
    [],
  );

  // Check if any filters are active
  const isFiltered = globalFilter !== "" || columnFilters.length > 0;

  // Reset all filters
  const resetFilters = React.useCallback(() => {
    setGlobalFilterInput("");
    setGlobalFilterState("");
    setColumnFiltersState([]);
  }, []);

  // Reset global filter only
  const resetGlobalFilter = React.useCallback(() => {
    setGlobalFilterInput("");
    setGlobalFilterState("");
  }, []);

  // Reset column filters only
  const resetColumnFilters = React.useCallback(() => {
    setColumnFiltersState([]);
  }, []);

  // Get filter value for a specific column
  const getColumnFilterValue = React.useCallback(
    <T = unknown>(columnId: string): T | undefined => {
      const filter = columnFilters.find((f) => f.id === columnId);
      return filter?.value as T | undefined;
    },
    [columnFilters],
  );

  // Set filter value for a specific column
  const setColumnFilterValue = React.useCallback(
    <T = unknown>(columnId: string, value: T) => {
      setColumnFiltersState((prev) => {
        const existing = prev.find((f) => f.id === columnId);

        // Remove filter if value is empty/undefined
        if (value === undefined || value === null || value === "") {
          return prev.filter((f) => f.id !== columnId);
        }

        if (
          Array.isArray(value) &&
          (value.length === 0 ||
            (value.length === 2 &&
              value[0] === undefined &&
              value[1] === undefined))
        ) {
          return prev.filter((f) => f.id !== columnId);
        }

        if (existing) {
          return prev.map((f) => (f.id === columnId ? { ...f, value } : f));
        }

        return [...prev, { id: columnId, value }];
      });
    },
    [],
  );

  return {
    globalFilter,
    setGlobalFilter,
    globalFilterInput,
    setGlobalFilterInput,
    columnFilters,
    setColumnFilters,
    isFiltered,
    resetFilters,
    resetGlobalFilter,
    resetColumnFilters,
    getColumnFilterValue,
    setColumnFilterValue,
  };
}
