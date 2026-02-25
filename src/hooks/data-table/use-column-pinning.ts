"use client";

import { ColumnPinningState } from "@tanstack/react-table";
import * as React from "react";

/** Default column IDs that are always pinned and cannot be reordered */
export const DEFAULT_FIXED_COLUMN_IDS = [
  "select",
  "actions",
  "expand",
] as const;

interface UseColumnPinningOptions {
  /**
   * Initial column pinning state
   */
  initialColumnPinning?: ColumnPinningState;
  /**
   * Whether column pinning is enabled
   */
  enabled?: boolean;
  /**
   * Column IDs that are fixed (cannot be unpinned or reordered)
   * Defaults to ["select", "actions", "expand"]
   */
  fixedColumnIds?: string[];
}

interface UseColumnPinningReturn {
  /**
   * Current column pinning state
   */
  columnPinning: ColumnPinningState;
  /**
   * State setter for column pinning
   */
  setColumnPinning: React.Dispatch<React.SetStateAction<ColumnPinningState>>;
  /**
   * Pin a column to left, right, or unpin it
   */
  pinColumn: (columnId: string, position: "left" | "right" | false) => void;
  /**
   * Get the left offset for a pinned column
   */
  getLeftPinOffset: (columnId: string) => number;
  /**
   * Get the right offset for a pinned column
   */
  getRightPinOffset: (columnId: string) => number;
  /**
   * Ref callback for header cells to measure widths
   */
  setHeaderRef: (columnId: string, el: HTMLTableCellElement | null) => void;
  /**
   * Measured column widths
   */
  columnWidths: Record<string, number>;
  /**
   * Number of content columns (non-select, non-actions) pinned to the left
   */
  leftContentColumnCount: number;
  /**
   * Number of content columns (non-select, non-actions) pinned to the right
   */
  rightContentColumnCount: number;
  /**
   * Check if a column is a fixed column (select/actions)
   */
  isFixedColumn: (columnId: string) => boolean;
  /**
   * Reorder columns within a pinning group
   */
  reorderPinnedColumns: (
    position: "left" | "right",
    newOrder: string[],
  ) => void;
}

/**
 * Hook for managing column pinning state and calculations
 */
export function useColumnPinning({
  initialColumnPinning,
  enabled = false,
  fixedColumnIds = [...DEFAULT_FIXED_COLUMN_IDS],
}: UseColumnPinningOptions = {}): UseColumnPinningReturn {
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialColumnPinning ?? { left: [], right: [] },
  );

  // Track column widths for pinning offset calculations
  const [columnWidths, setColumnWidths] = React.useState<
    Record<string, number>
  >({});
  const headerRefs = React.useRef<Map<string, HTMLTableCellElement>>(new Map());

  // Measure column widths when headers render or pinning changes
  React.useEffect(() => {
    if (!enabled) return;

    const measureWidths = () => {
      const widths: Record<string, number> = {};
      headerRefs.current.forEach((el, id) => {
        if (el) {
          widths[id] = el.offsetWidth;
        }
      });
      setColumnWidths(widths);
    };

    // Measure after a short delay to ensure layout is complete
    const timeoutId = setTimeout(measureWidths, 0);
    return () => clearTimeout(timeoutId);
  }, [columnPinning, enabled]);

  // Ref callback for header cells
  const setHeaderRef = React.useCallback(
    (columnId: string, el: HTMLTableCellElement | null) => {
      if (el) {
        headerRefs.current.set(columnId, el);
      } else {
        headerRefs.current.delete(columnId);
      }
    },
    [],
  );

  // Calculate left offset for a pinned column
  const getLeftPinOffset = React.useCallback(
    (columnId: string) => {
      const leftPinned = columnPinning.left ?? [];
      const index = leftPinned.indexOf(columnId);
      if (index <= 0) return 0;

      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += columnWidths[leftPinned[i]] ?? 0;
      }
      return offset;
    },
    [columnPinning.left, columnWidths],
  );

  // Calculate right offset for a pinned column
  const getRightPinOffset = React.useCallback(
    (columnId: string) => {
      const rightPinned = columnPinning.right ?? [];
      const index = rightPinned.indexOf(columnId);
      if (index === -1) return 0;

      let offset = 0;
      // Sum widths of columns that come AFTER this one in the right pinned list
      for (let i = index + 1; i < rightPinned.length; i++) {
        offset += columnWidths[rightPinned[i]] ?? 0;
      }
      return offset;
    },
    [columnPinning.right, columnWidths],
  );

  // Pin column handler - updates React state directly to ensure re-render
  const pinColumn = React.useCallback(
    (columnId: string, position: "left" | "right" | false) => {
      // Prevent unpinning fixed columns
      if (position === false && fixedColumnIds.includes(columnId)) {
        return;
      }

      setColumnPinning((prev) => {
        const newLeft = prev.left?.filter((id) => id !== columnId) ?? [];
        const newRight = prev.right?.filter((id) => id !== columnId) ?? [];

        if (position === "left") {
          newLeft.push(columnId);
        } else if (position === "right") {
          newRight.push(columnId);
        }

        return { left: newLeft, right: newRight };
      });
    },
    [fixedColumnIds],
  );

  // Check if a column is a fixed column
  const isFixedColumn = React.useCallback(
    (columnId: string) => {
      return fixedColumnIds.includes(columnId);
    },
    [fixedColumnIds],
  );

  // Count content columns (non-fixed) pinned to each side
  const leftContentColumnCount = React.useMemo(() => {
    return (columnPinning.left ?? []).filter(
      (id) => !fixedColumnIds.includes(id),
    ).length;
  }, [columnPinning.left, fixedColumnIds]);

  const rightContentColumnCount = React.useMemo(() => {
    return (columnPinning.right ?? []).filter(
      (id) => !fixedColumnIds.includes(id),
    ).length;
  }, [columnPinning.right, fixedColumnIds]);

  // Reorder columns within a pinning group
  const reorderPinnedColumns = React.useCallback(
    (position: "left" | "right", newOrder: string[]) => {
      setColumnPinning((prev) => ({
        ...prev,
        [position]: newOrder,
      }));
    },
    [],
  );

  return {
    columnPinning,
    setColumnPinning,
    pinColumn,
    getLeftPinOffset,
    getRightPinOffset,
    setHeaderRef,
    columnWidths,
    leftContentColumnCount,
    rightContentColumnCount,
    isFixedColumn,
    reorderPinnedColumns,
  };
}
