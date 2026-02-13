"use client";

import { Column, Table } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isDataTableMeta } from "@/lib/types/data-table/data-table-types";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  table: Table<TData>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  table,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const meta = table.options.meta;
  const pinColumn = isDataTableMeta(meta) ? meta.pinColumn : undefined;
  const columnPinning = isDataTableMeta(meta) ? meta.columnPinning : undefined;
  const isFixedColumn = isDataTableMeta(meta) ? meta.isFixedColumn : undefined;

  // Read from meta.columnPinning for proper React reactivity
  const isPinnedLeft = columnPinning?.left?.includes(column.id) ?? false;
  const isPinnedRight = columnPinning?.right?.includes(column.id) ?? false;
  const isPinned: "left" | "right" | false = isPinnedLeft
    ? "left"
    : isPinnedRight
      ? "right"
      : false;

  // Fixed columns cannot be unpinned or moved
  const isFixed = isFixedColumn?.(column.id) ?? false;

  const canSort = column.getCanSort();
  const canPin = pinColumn && column.getCanPin() && !isFixed;
  const canHide = column.getCanHide();

  // Multi-sort indicator: show sort index when multiple columns are sorted
  const sortIndex = column.getSortIndex();
  const isSorted = column.getIsSorted();
  const sortingState = table.getState().sorting;
  const isMultiSorted = sortingState.length > 1;

  if (!canSort && !canPin) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent h-8 gap-1 px-2"
          >
            <span>{title}</span>
            {isPinned && <PinIcon className="text-primary size-3" />}
            {canSort &&
              (isSorted === "desc" ? (
                <span className="flex items-center">
                  <ArrowDownIcon className="size-4" />
                  {isMultiSorted && sortIndex !== -1 && (
                    <span className="text-muted-foreground ml-0.5 text-xs">
                      {sortIndex + 1}
                    </span>
                  )}
                </span>
              ) : isSorted === "asc" ? (
                <span className="flex items-center">
                  <ArrowUpIcon className="size-4" />
                  {isMultiSorted && sortIndex !== -1 && (
                    <span className="text-muted-foreground ml-0.5 text-xs">
                      {sortIndex + 1}
                    </span>
                  )}
                </span>
              ) : (
                <ChevronsUpDownIcon className="size-4" />
              ))}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon className="text-muted-foreground/70 size-3.5" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon className="text-muted-foreground/70 size-3.5" />
                Desc
              </DropdownMenuItem>
              {isSorted && (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <XIcon className="text-muted-foreground/70 size-3.5" />
                  Clear
                </DropdownMenuItem>
              )}
            </>
          )}
          {canPin && (
            <>
              {canSort && <DropdownMenuSeparator />}
              {isPinned === "left" && (
                <>
                  <DropdownMenuItem
                    onClick={() => pinColumn(column.id, "right")}
                  >
                    <PinIcon className="text-muted-foreground/70 size-3.5" />
                    Move to right
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => pinColumn(column.id, false)}>
                    <PinOffIcon className="text-muted-foreground/70 size-3.5" />
                    Unpin from left
                  </DropdownMenuItem>
                </>
              )}
              {isPinned === "right" && (
                <>
                  <DropdownMenuItem
                    onClick={() => pinColumn(column.id, "left")}
                  >
                    <PinIcon className="text-muted-foreground/70 size-3.5" />
                    Move to left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => pinColumn(column.id, false)}>
                    <PinOffIcon className="text-muted-foreground/70 size-3.5" />
                    Unpin from right
                  </DropdownMenuItem>
                </>
              )}
              {!isPinned && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <PinIcon className="text-muted-foreground/70 size-3.5" />
                    Pin column
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => pinColumn(column.id, "left")}
                    >
                      Pin to left
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => pinColumn(column.id, "right")}
                    >
                      Pin to right
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </>
          )}
          {canHide && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOffIcon className="text-muted-foreground/70 size-3.5" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
