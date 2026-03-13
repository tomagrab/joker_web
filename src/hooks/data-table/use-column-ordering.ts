"use client";

import {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
} from "@tanstack/react-table";
import * as React from "react";

import { DEFAULT_FIXED_COLUMN_IDS } from "@/hooks/data-table/use-column-pinning";

interface UseColumnOrderingOptions<TData, TValue> {
  /**
   * Column definitions to derive initial order from
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Whether column ordering is enabled
   */
  enabled?: boolean;
  /**
   * Column IDs that should not be draggable (fixed columns like select/actions)
   */
  excludedColumnIds?: string[];
  /**
   * Current column pinning state (used to determine drag handle visibility)
   */
  columnPinning?: ColumnPinningState;
  /**
   * Number of content columns pinned to the left (excluding fixed columns)
   */
  leftContentColumnCount?: number;
  /**
   * Number of content columns pinned to the right (excluding fixed columns)
   */
  rightContentColumnCount?: number;
  /**
   * Callback to reorder columns within the pinning state
   * This is needed because pinned column order is controlled by the pinning arrays, not columnOrder
   */
  onReorderPinnedColumns?: (
    position: "left" | "right",
    newOrder: string[],
  ) => void;
}

interface UseColumnOrderingReturn {
  /**
   * Current column order state
   */
  columnOrder: ColumnOrderState;
  /**
   * State setter for column order
   */
  setColumnOrder: React.Dispatch<React.SetStateAction<ColumnOrderState>>;
  /**
   * Currently dragging column ID
   */
  draggingColumnId: string | null;
  /**
   * Column ID being dragged over
   */
  dragOverColumnId: string | null;
  /**
   * Check if a column can be dragged
   */
  canDrag: (columnId: string) => boolean;
  /**
   * Drag event handlers for table header cells
   */
  dragHandlers: {
    onDragStart: (
      e: React.DragEvent<HTMLTableCellElement>,
      columnId: string,
    ) => void;
    onDragOver: (
      e: React.DragEvent<HTMLTableCellElement>,
      columnId: string,
    ) => void;
    onDragLeave: () => void;
    onDrop: (
      e: React.DragEvent<HTMLTableCellElement>,
      targetColumnId: string,
    ) => void;
    onDragEnd: () => void;
  };
}

/**
 * Extract column ID from a column definition
 */
function getColumnId<TData, TValue>(col: ColumnDef<TData, TValue>): string {
  return (
    (col as { id?: string }).id ||
    (col as { accessorKey?: string }).accessorKey ||
    ""
  );
}

/**
 * Hook for managing column ordering via drag and drop
 */
export function useColumnOrdering<TData, TValue>({
  columns,
  enabled = false,
  excludedColumnIds = [...DEFAULT_FIXED_COLUMN_IDS],
  columnPinning,
  leftContentColumnCount = 0,
  rightContentColumnCount = 0,
  onReorderPinnedColumns,
}: UseColumnOrderingOptions<TData, TValue>): UseColumnOrderingReturn {
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [draggingColumnId, setDraggingColumnId] = React.useState<string | null>(
    null,
  );
  const [dragOverColumnId, setDragOverColumnId] = React.useState<string | null>(
    null,
  );

  // Initialize column order from columns when they change
  React.useEffect(() => {
    if (enabled && columnOrder.length === 0) {
      setColumnOrder(columns.map(getColumnId));
    }
  }, [columns, enabled, columnOrder.length]);

  // Check if a column can be dragged
  // - Fixed columns (select/actions) are never draggable
  // - Pinned content columns are only draggable if there are 2+ content columns on that side
  // - Unpinned columns are always draggable (if ordering is enabled)
  const canDrag = React.useCallback(
    (columnId: string) => {
      if (!enabled) return false;
      if (excludedColumnIds.includes(columnId)) return false;

      // Check if column is pinned
      const isPinnedLeft = columnPinning?.left?.includes(columnId) ?? false;
      const isPinnedRight = columnPinning?.right?.includes(columnId) ?? false;

      // If pinned left, only draggable if 2+ content columns are pinned left
      if (isPinnedLeft) {
        return leftContentColumnCount >= 2;
      }

      // If pinned right, only draggable if 2+ content columns are pinned right
      if (isPinnedRight) {
        return rightContentColumnCount >= 2;
      }

      // Unpinned columns are always draggable
      return true;
    },
    [
      enabled,
      excludedColumnIds,
      columnPinning,
      leftContentColumnCount,
      rightContentColumnCount,
    ],
  );

  // Get the pinning group of a column
  const getPinningGroup = React.useCallback(
    (columnId: string): "left" | "right" | "none" => {
      if (columnPinning?.left?.includes(columnId)) return "left";
      if (columnPinning?.right?.includes(columnId)) return "right";
      return "none";
    },
    [columnPinning],
  );

  // Check if two columns are in the same pinning group
  const canDropOnTarget = React.useCallback(
    (draggedColumnId: string, targetColumnId: string): boolean => {
      // Can only drop on targets that are in the same pinning group
      return (
        getPinningGroup(draggedColumnId) === getPinningGroup(targetColumnId)
      );
    },
    [getPinningGroup],
  );

  // Column reorder handler
  const handleColumnReorder = React.useCallback(
    (draggedColumnId: string, targetColumnId: string) => {
      // Only allow reordering within the same pinning group
      const pinningGroup = getPinningGroup(draggedColumnId);
      if (pinningGroup !== getPinningGroup(targetColumnId)) {
        return;
      }

      // For pinned columns, we need to reorder within the pinning state arrays
      // The order of pinned columns is controlled by the columnPinning.left/right arrays
      if (
        pinningGroup === "left" &&
        columnPinning?.left &&
        onReorderPinnedColumns
      ) {
        const newOrder = [...columnPinning.left];
        const draggedIndex = newOrder.indexOf(draggedColumnId);
        const targetIndex = newOrder.indexOf(targetColumnId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Remove dragged column and insert at target position
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumnId);

        onReorderPinnedColumns("left", newOrder);
        return;
      }

      if (
        pinningGroup === "right" &&
        columnPinning?.right &&
        onReorderPinnedColumns
      ) {
        const newOrder = [...columnPinning.right];
        const draggedIndex = newOrder.indexOf(draggedColumnId);
        const targetIndex = newOrder.indexOf(targetColumnId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Remove dragged column and insert at target position
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumnId);

        onReorderPinnedColumns("right", newOrder);
        return;
      }

      // For unpinned (center) columns, use the columnOrder state
      setColumnOrder((currentOrder) => {
        const order = currentOrder.length
          ? [...currentOrder]
          : columns.map(getColumnId);

        const draggedIndex = order.indexOf(draggedColumnId);
        const targetIndex = order.indexOf(targetColumnId);

        if (draggedIndex === -1 || targetIndex === -1) return currentOrder;

        // Remove dragged column and insert at target position
        order.splice(draggedIndex, 1);
        order.splice(targetIndex, 0, draggedColumnId);

        return order;
      });
    },
    [columns, getPinningGroup, columnPinning, onReorderPinnedColumns],
  );

  // Drag event handlers
  const handleDragStart = React.useCallback(
    (e: React.DragEvent<HTMLTableCellElement>, columnId: string) => {
      setDraggingColumnId(columnId);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", columnId);
    },
    [],
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLTableCellElement>, columnId: string) => {
      e.preventDefault();

      // Only show drop indicator if columns are in the same pinning group
      if (draggingColumnId && canDropOnTarget(draggingColumnId, columnId)) {
        e.dataTransfer.dropEffect = "move";
        if (columnId !== draggingColumnId) {
          setDragOverColumnId(columnId);
        }
      } else {
        e.dataTransfer.dropEffect = "none";
        setDragOverColumnId(null);
      }
    },
    [draggingColumnId, canDropOnTarget],
  );

  const handleDragLeave = React.useCallback(() => {
    setDragOverColumnId(null);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLTableCellElement>, targetColumnId: string) => {
      e.preventDefault();
      const draggedColumnId = e.dataTransfer.getData("text/plain");
      if (
        draggedColumnId &&
        draggedColumnId !== targetColumnId &&
        canDropOnTarget(draggedColumnId, targetColumnId)
      ) {
        handleColumnReorder(draggedColumnId, targetColumnId);
      }
      setDraggingColumnId(null);
      setDragOverColumnId(null);
    },
    [handleColumnReorder, canDropOnTarget],
  );

  const handleDragEnd = React.useCallback(() => {
    setDraggingColumnId(null);
    setDragOverColumnId(null);
  }, []);

  return {
    columnOrder,
    setColumnOrder,
    draggingColumnId,
    dragOverColumnId,
    canDrag,
    dragHandlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    },
  };
}
