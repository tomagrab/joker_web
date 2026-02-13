"use client";

import { Header, flexRender } from "@tanstack/react-table";
import { GripVerticalIcon } from "lucide-react";
import * as React from "react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DragHandlers {
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
}

interface DataTableHeaderCellProps<TData, TValue> {
  header: Header<TData, TValue>;
  isColumnDraggable: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  dragHandlers: DragHandlers;
  setHeaderRef: (columnId: string, el: HTMLTableCellElement | null) => void;
  getLeftPinOffset: (columnId: string) => number;
  getRightPinOffset: (columnId: string) => number;
}

export function DataTableHeaderCell<TData, TValue>({
  header,
  isColumnDraggable,
  isDragging,
  isDragOver,
  dragHandlers,
  setHeaderRef,
  getLeftPinOffset,
  getRightPinOffset,
}: DataTableHeaderCellProps<TData, TValue>) {
  const isPinned = header.column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && header.column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && header.column.getIsFirstColumn("right");

  return (
    <TableHead
      colSpan={header.colSpan}
      draggable={isColumnDraggable}
      onDragStart={
        isColumnDraggable
          ? (e) => dragHandlers.onDragStart(e, header.column.id)
          : undefined
      }
      onDragOver={
        isColumnDraggable
          ? (e) => dragHandlers.onDragOver(e, header.column.id)
          : undefined
      }
      onDragLeave={isColumnDraggable ? dragHandlers.onDragLeave : undefined}
      onDrop={
        isColumnDraggable
          ? (e) => dragHandlers.onDrop(e, header.column.id)
          : undefined
      }
      onDragEnd={isColumnDraggable ? dragHandlers.onDragEnd : undefined}
      ref={(el) => setHeaderRef(header.column.id, el)}
      className={cn(
        "relative",
        isColumnDraggable && "cursor-grab",
        isDragging && "opacity-50",
        isDragOver && "bg-accent ring-primary ring-2 ring-inset",
        isPinned && "bg-muted sticky z-10",
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
                  ? `${getLeftPinOffset(header.column.id)}px`
                  : undefined,
              right:
                isPinned === "right"
                  ? `${getRightPinOffset(header.column.id)}px`
                  : undefined,
            }
          : undefined
      }
    >
      <div className="flex items-center gap-1">
        {isColumnDraggable && (
          <GripVerticalIcon className="text-muted-foreground/50 size-4 shrink-0" />
        )}
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    </TableHead>
  );
}
