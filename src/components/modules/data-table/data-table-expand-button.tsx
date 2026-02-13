"use client";

import { Row } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableExpandButtonProps<TData> {
  /**
   * The row instance to control expansion for
   */
  row: Row<TData>;
  /**
   * Additional class name for the button
   */
  className?: string;
  /**
   * Whether to show indent based on row depth (for sub-rows)
   */
  showIndent?: boolean;
  /**
   * Indent size in pixels per depth level (default: 16)
   */
  indentSize?: number;
}

/**
 * Expand/collapse button for table rows.
 * Used to toggle visibility of sub-rows or detail panels.
 *
 * @example
 * ```tsx
 * // In a column definition
 * {
 *   id: "expand",
 *   cell: ({ row }) => <DataTableExpandButton row={row} />,
 * }
 * ```
 */
export function DataTableExpandButton<TData>({
  row,
  className,
  showIndent = false,
  indentSize = 16,
}: DataTableExpandButtonProps<TData>) {
  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();
  const depth = row.depth;

  if (!canExpand) {
    // Return empty space to maintain alignment when row can't expand
    return (
      <div
        className={cn("flex items-center", className)}
        style={
          showIndent ? { paddingLeft: `${depth * indentSize}px` } : undefined
        }
      >
        <div className="size-8" />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center", className)}
      style={
        showIndent ? { paddingLeft: `${depth * indentSize}px` } : undefined
      }
    >
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={(e) => {
          e.stopPropagation();
          row.toggleExpanded();
        }}
        aria-label={isExpanded ? "Collapse row" : "Expand row"}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDownIcon className="size-4" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
