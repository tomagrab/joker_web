"use client";

import { DataTableExpandButton } from "@/components/modules/data-table/data-table-expand-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import * as React from "react";

// ============================================================================
// Select Column Helper
// ============================================================================

interface SelectColumnOptions {
  /**
   * Column ID (default: "select")
   */
  id?: string;
  /**
   * Enable header checkbox for "select all" (default: true)
   */
  enableSelectAll?: boolean;
}

/**
 * Creates a selection checkbox column for row selection.
 *
 * @example
 * ```tsx
 * const columns = [
 *   createSelectColumn<User>(),
 *   // ... other columns
 * ];
 * ```
 */
export function createSelectColumn<TData>(
  options: SelectColumnOptions = {},
): ColumnDef<TData, unknown> {
  const { id = "select", enableSelectAll = true } = options;

  return {
    id,
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    header: enableSelectAll
      ? ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        )
      : undefined,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  };
}

// ============================================================================
// Expand Column Helper
// ============================================================================

interface ExpandColumnOptions {
  /**
   * Column ID (default: "expand")
   */
  id?: string;
  /**
   * Show indentation for sub-rows (default: false)
   */
  showIndent?: boolean;
  /**
   * Indent size in pixels per depth level (default: 16)
   */
  indentSize?: number;
}

/**
 * Creates an expand/collapse button column for expandable rows.
 *
 * @example
 * ```tsx
 * const columns = [
 *   createExpandColumn<User>(),
 *   // ... other columns
 * ];
 * ```
 */
export function createExpandColumn<TData>(
  options: ExpandColumnOptions = {},
): ColumnDef<TData, unknown> {
  const { id = "expand", showIndent = false, indentSize = 16 } = options;

  return {
    id,
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => (
      <DataTableExpandButton
        row={row}
        showIndent={showIndent}
        indentSize={indentSize}
      />
    ),
  };
}

// ============================================================================
// Actions Column Helper
// ============================================================================

interface ActionItem<TData> {
  /**
   * Label for the action
   */
  label: string;
  /**
   * Handler when action is clicked
   */
  onClick: (row: Row<TData>) => void;
  /**
   * Optional icon component
   */
  icon?: React.ComponentType<{ className?: string }>;
  /**
   * Whether to show a separator before this action
   */
  separator?: boolean;
  /**
   * Whether the action is disabled
   */
  disabled?: boolean | ((row: Row<TData>) => boolean);
  /**
   * Whether the action is destructive (styled red)
   */
  destructive?: boolean;
}

interface ActionsColumnOptions<TData> {
  /**
   * Column ID (default: "actions")
   */
  id?: string;
  /**
   * Menu label shown at the top (default: "Actions")
   */
  menuLabel?: string;
  /**
   * Actions to show in the dropdown
   */
  actions: ActionItem<TData>[];
}

/**
 * Creates an actions dropdown column with customizable menu items.
 *
 * @example
 * ```tsx
 * const columns = [
 *   // ... other columns
 *   createActionsColumn<User>({
 *     actions: [
 *       { label: "Edit", onClick: (row) => handleEdit(row.original) },
 *       { label: "Delete", onClick: (row) => handleDelete(row.original), destructive: true, separator: true },
 *     ],
 *   }),
 * ];
 * ```
 */
export function createActionsColumn<TData>(
  options: ActionsColumnOptions<TData>,
): ColumnDef<TData, unknown> {
  const { id = "actions", menuLabel = "Actions", actions } = options;

  return {
    id,
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, index) => {
            const isDisabled =
              typeof action.disabled === "function"
                ? action.disabled(row)
                : action.disabled;

            return (
              <React.Fragment key={index}>
                {action.separator && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => action.onClick(row)}
                  disabled={isDisabled}
                  className={
                    action.destructive ? "text-destructive" : undefined
                  }
                >
                  {action.icon && <action.icon className="mr-2 size-4" />}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };
}

// ============================================================================
// Index Column Helper
// ============================================================================

interface IndexColumnOptions {
  /**
   * Column ID (default: "index")
   */
  id?: string;
  /**
   * Header text (default: "#")
   */
  header?: string;
  /**
   * Start index from (default: 1)
   */
  startFrom?: number;
}

/**
 * Creates a row index column showing row numbers.
 *
 * @example
 * ```tsx
 * const columns = [
 *   createIndexColumn<User>(),
 *   // ... other columns
 * ];
 * ```
 */
export function createIndexColumn<TData>(
  options: IndexColumnOptions = {},
): ColumnDef<TData, unknown> {
  const { id = "index", header = "#", startFrom = 1 } = options;

  return {
    id,
    size: 50,
    minSize: 50,
    maxSize: 80,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    header: () => <span className="text-muted-foreground">{header}</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.index + startFrom}
      </span>
    ),
  };
}
