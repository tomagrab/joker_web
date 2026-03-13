"use client";

import { DataTableBodyCell } from "@/components/modules/data-table//data-table-body-cell";
import { DataTableEmptyState } from "@/components/modules/data-table//data-table-empty-state";
import { DataTableHeaderCell } from "@/components/modules/data-table//data-table-header-cell";
import { DataTablePagination } from "@/components/modules/data-table//data-table-pagination";
import { DataTableSkeletonRows } from "@/components/modules/data-table//data-table-skeleton";
import { DataTableToolbar } from "@/components/modules/data-table//data-table-toolbar";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useColumnOrdering } from "@/hooks/data-table/use-column-ordering";
import { useColumnPinning } from "@/hooks/data-table/use-column-pinning";
import { dataTableFilterFns, fuzzyFilter } from "@/lib/data-table/filter-fns";
import {
  DataTableMeta,
  DataTableProps,
} from "@/lib/types/data-table/data-table-types";
import { cn } from "@/lib/utils";
import {
  ColumnFiltersState,
  ExpandedState,
  FilterFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";

export default function DataTable<TData, TValue>({
  columns,
  data,
  showToolbar = true,
  showPagination = true,
  pageSizeOptions,
  initialPageSize = 10,
  onRowSelectionChange,
  tableOptions,
  className,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  initialColumnPinning,
  fixedColumnIds,
  isLoading = false,
  loadingRowCount = 5,
  emptyState,
  toolbarLeftContent,
  renderToolbarLeftContent,
  toolbarRightContent,
  renderToolbarRightContent,
  enableGlobalFilter = false,
  globalFilterPlaceholder,
  globalFilterDebounceMs = 300,
  globalFilterFn,
  initialGlobalFilter = "",
  initialColumnFilters = [],
  onGlobalFilterChange,
  onColumnFiltersChange,
  manualFiltering = false,
  enableExpanding = false,
  getSubRows,
  getRowCanExpand,
  initialExpanded = {},
  onExpandedChange,
  paginateExpandedRows = true,
  renderExpandedContent,
  manualExpanding = false,
  filterFromLeafRows = false,
  maxLeafRowFilterDepth = 100,
  autoResetPageIndex,
  showGoToPage = false,
  showRowRange = false,
  enableRowSelection = true,
  enableMultiRowSelection = true,
  enableSubRowSelection = true,
  initialRowSelection = {},
  getRowId,
  // Sorting props
  enableSorting = true,
  initialSorting = [],
  onSortingChange: onSortingChangeProp,
  manualSorting = false,
  enableMultiSort = true,
  enableSortingRemoval = true,
  maxMultiSortColCount,
  // Pagination props
  manualPagination = false,
  onPaginationChange: onPaginationChangeProp,
  rowCount,
  // Column visibility props
  initialColumnVisibility = {},
  onColumnVisibilityChange: onColumnVisibilityChangeProp,
  // Row interaction props
  onRowClick,
  onRowDoubleClick,
  // Virtualization props
  enableVirtualization = false,
  estimatedRowHeight = 40,
  overscan = 5,
  virtualTableHeight,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);
  const [globalFilter, setGlobalFilter] =
    React.useState<string>(initialGlobalFilter);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility);
  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(initialRowSelection);
  const [expanded, setExpanded] =
    React.useState<ExpandedState>(initialExpanded);

  // Column pinning hook
  const {
    columnPinning,
    setColumnPinning,
    pinColumn,
    getLeftPinOffset,
    getRightPinOffset,
    setHeaderRef,
    leftContentColumnCount,
    rightContentColumnCount,
    isFixedColumn,
    reorderPinnedColumns,
  } = useColumnPinning({
    initialColumnPinning,
    enabled: enableColumnPinning,
    fixedColumnIds,
  });

  // Column ordering hook
  const {
    columnOrder,
    setColumnOrder,
    draggingColumnId,
    dragOverColumnId,
    canDrag,
    dragHandlers,
  } = useColumnOrdering({
    columns,
    enabled: enableColumnOrdering,
    columnPinning,
    leftContentColumnCount,
    rightContentColumnCount,
    onReorderPinnedColumns: reorderPinnedColumns,
  });

  // Determine the global filter function to use
  const resolvedGlobalFilterFn =
    React.useMemo((): // eslint-disable-next-line @typescript-eslint/no-explicit-any
      FilterFn<any> | undefined => {
      if (typeof globalFilterFn === "function") return globalFilterFn;
      // If string is provided, we'll rely on filterFns registration
      if (typeof globalFilterFn === "string") {
        return (
          dataTableFilterFns[
            globalFilterFn as keyof typeof dataTableFilterFns
          ] ?? undefined
        );
      }
      return enableGlobalFilter ? fuzzyFilter : undefined;
    }, [globalFilterFn, enableGlobalFilter]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
      ...(enableGlobalFilter ? { globalFilter } : {}),
      ...(enableColumnOrdering && columnOrder.length > 0
        ? { columnOrder }
        : {}),
      ...(enableExpanding ? { expanded } : {}),
    },
    // Row selection configuration
    enableRowSelection,
    enableMultiRowSelection,
    enableSubRowSelection,
    ...(getRowId ? { getRowId } : {}),
    // Sorting configuration
    enableSorting,
    enableMultiSort,
    enableSortingRemoval,
    manualSorting,
    ...(maxMultiSortColCount !== undefined ? { maxMultiSortColCount } : {}),
    // Pagination configuration
    manualPagination,
    ...(rowCount !== undefined ? { rowCount } : {}),
    // Column and filter configuration
    enableColumnPinning,
    enableGlobalFilter,
    enableExpanding,
    manualFiltering,
    manualExpanding,
    paginateExpandedRows,
    filterFromLeafRows,
    maxLeafRowFilterDepth,
    // Auto reset page index when data/filters change (unless explicitly set)
    ...(autoResetPageIndex !== undefined ? { autoResetPageIndex } : {}),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    onGlobalFilterChange: setGlobalFilter,
    ...(enableExpanding ? { onExpandedChange: setExpanded } : {}),
    ...(enableColumnOrdering ? { onColumnOrderChange: setColumnOrder } : {}),
    // Sub-rows configuration
    ...(getSubRows ? { getSubRows } : {}),
    ...(getRowCanExpand ? { getRowCanExpand } : {}),
    // Register custom filter functions
    filterFns: dataTableFilterFns,
    // Apply global filter function (fuzzy by default when enabled)
    ...(resolvedGlobalFilterFn
      ? { globalFilterFn: resolvedGlobalFilterFn }
      : {}),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Only include getSortedRowModel if not using manual sorting
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
    // Only include getFilteredRowModel if not using manual filtering
    ...(manualFiltering ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    // Expanded row model
    ...(enableExpanding ? { getExpandedRowModel: getExpandedRowModel() } : {}),
    // Faceting row models for filter UI components
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    meta: {
      pinColumn,
      columnPinning,
      isFixedColumn,
    } satisfies DataTableMeta,
    ...tableOptions,
  });

  // Notify parent of row selection changes
  React.useEffect(() => {
    onRowSelectionChange?.(rowSelection);
  }, [rowSelection, onRowSelectionChange]);

  // Notify parent of sorting changes
  React.useEffect(() => {
    onSortingChangeProp?.(sorting);
  }, [sorting, onSortingChangeProp]);

  // Notify parent of pagination changes
  React.useEffect(() => {
    onPaginationChangeProp?.(pagination);
  }, [pagination, onPaginationChangeProp]);

  // Notify parent of column visibility changes
  React.useEffect(() => {
    onColumnVisibilityChangeProp?.(columnVisibility);
  }, [columnVisibility, onColumnVisibilityChangeProp]);

  // Notify parent of global filter changes
  React.useEffect(() => {
    onGlobalFilterChange?.(globalFilter);
  }, [globalFilter, onGlobalFilterChange]);

  // Notify parent of column filter changes
  React.useEffect(() => {
    onColumnFiltersChange?.(columnFilters);
  }, [columnFilters, onColumnFiltersChange]);

  // Notify parent of expanded state changes
  React.useEffect(() => {
    onExpandedChange?.(expanded);
  }, [expanded, onExpandedChange]);

  // Resolve toolbar content - render props take precedence
  const resolvedLeftContent = renderToolbarLeftContent
    ? renderToolbarLeftContent(table)
    : toolbarLeftContent;
  const resolvedRightContent = renderToolbarRightContent
    ? renderToolbarRightContent(table)
    : toolbarRightContent;

  // Get rows from table model
  const { rows } = table.getRowModel();

  // Ref for the scrollable table container (used by virtualizer)
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Calculate initial rect for virtualizer - provides dimensions before measurement
  // This fixes the issue where rows don't render until browser resize
  const initialRect = React.useMemo(() => {
    if (!enableVirtualization) return undefined;
    // Parse the virtualTableHeight to get a numeric height
    let height = 400; // Default fallback
    if (typeof virtualTableHeight === "number") {
      height = virtualTableHeight;
    } else if (typeof virtualTableHeight === "string") {
      // Try to parse numeric value from string like "500px"
      const parsed = parseInt(virtualTableHeight, 10);
      if (!isNaN(parsed)) {
        height = parsed;
      }
    }
    return { width: 0, height };
  }, [enableVirtualization, virtualTableHeight]);

  // Row virtualizer for rendering only visible rows
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan,
    enabled: enableVirtualization,
    // Provide initial dimensions to fix SSR/hydration issues
    initialRect,
  });

  // Calculate the container height style
  const containerHeightStyle = React.useMemo(() => {
    if (!enableVirtualization) return undefined;
    if (typeof virtualTableHeight === "number") {
      return `${virtualTableHeight}px`;
    }
    return virtualTableHeight ?? "500px"; // Default height if not specified
  }, [enableVirtualization, virtualTableHeight]);

  // Render a single row (shared between virtualized and non-virtualized modes)
  const renderRow = React.useCallback(
    (
      row: (typeof rows)[number],
      style?: React.CSSProperties,
      virtualIndex?: number,
    ) => {
      const isSelected = row.getIsSelected();
      return (
        <React.Fragment key={row.id}>
          <TableRow
            data-index={virtualIndex}
            data-state={isSelected && "selected"}
            onClick={onRowClick ? (e) => onRowClick(row, e) : undefined}
            onDoubleClick={
              onRowDoubleClick ? (e) => onRowDoubleClick(row, e) : undefined
            }
            className={cn((onRowClick || onRowDoubleClick) && "cursor-pointer")}
            style={style}
          >
            {row.getVisibleCells().map((cell) => (
              <DataTableBodyCell
                key={`${cell.id}-${isSelected}`}
                cell={cell}
                getLeftPinOffset={getLeftPinOffset}
                getRightPinOffset={getRightPinOffset}
              />
            ))}
          </TableRow>
          {/* Render expanded content if row is expanded and renderExpandedContent is provided */}
          {enableExpanding && renderExpandedContent && row.getIsExpanded() && (
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableCell colSpan={row.getVisibleCells().length} className="p-4">
                {renderExpandedContent(row)}
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    },
    [
      onRowClick,
      onRowDoubleClick,
      getLeftPinOffset,
      getRightPinOffset,
      enableExpanding,
      renderExpandedContent,
    ],
  );

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          enableGlobalFilter={enableGlobalFilter}
          globalFilterPlaceholder={globalFilterPlaceholder}
          globalFilterDebounceMs={globalFilterDebounceMs}
          leftContent={resolvedLeftContent}
          rightContent={resolvedRightContent}
        />
      )}
      <div className="flex min-h-0 flex-1 flex-col rounded-md border">
        {/* Fixed Header - outside scroll area */}
        <div className="bg-muted shrink-0 overflow-hidden border-b">
          <table
            className="w-full caption-bottom text-sm"
            style={{ tableLayout: "fixed", minWidth: table.getTotalSize() }}
          >
            <colgroup>
              {table.getAllLeafColumns().map((column) => (
                <col key={column.id} style={{ width: column.getSize() }} />
              ))}
            </colgroup>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b-0">
                  {headerGroup.headers.map((header) => (
                    <DataTableHeaderCell
                      key={`${header.id}-${Object.keys(rowSelection).length}-${sorting.map((s) => `${s.id}:${s.desc}`).join(",")}`}
                      header={header}
                      isColumnDraggable={canDrag(header.column.id)}
                      isDragging={draggingColumnId === header.column.id}
                      isDragOver={dragOverColumnId === header.column.id}
                      dragHandlers={dragHandlers}
                      setHeaderRef={setHeaderRef}
                      getLeftPinOffset={getLeftPinOffset}
                      getRightPinOffset={getRightPinOffset}
                    />
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          </table>
        </div>
        {/* Scrollable Body */}
        <div
          ref={tableContainerRef}
          className="min-h-0 flex-1 overflow-auto"
          style={
            containerHeightStyle ? { height: containerHeightStyle } : undefined
          }
        >
          <table
            className="w-full caption-bottom text-sm"
            style={{ tableLayout: "fixed", minWidth: table.getTotalSize() }}
          >
            <colgroup>
              {table.getAllLeafColumns().map((column) => (
                <col key={column.id} style={{ width: column.getSize() }} />
              ))}
            </colgroup>
            <TableBody>
              {isLoading ? (
                <DataTableSkeletonRows
                  rowCount={loadingRowCount}
                  columnCount={columns.length}
                />
              ) : rows.length ? (
                enableVirtualization ? (
                  // Virtualized rendering - only render visible rows
                  <>
                    {/* Spacer row for virtual scroll offset */}
                    {rowVirtualizer.getVirtualItems().length > 0 && (
                      <tr
                        style={{
                          height: `${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px`,
                        }}
                      />
                    )}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index];
                      return renderRow(
                        row,
                        { height: virtualRow.size },
                        virtualRow.index,
                      );
                    })}
                    {/* Spacer row for remaining virtual scroll space */}
                    {rowVirtualizer.getVirtualItems().length > 0 && (
                      <tr
                        style={{
                          height: `${
                            rowVirtualizer.getTotalSize() -
                            (rowVirtualizer.getVirtualItems().at(-1)?.end ?? 0)
                          }px`,
                        }}
                      />
                    )}
                  </>
                ) : (
                  // Non-virtualized rendering - render all rows
                  rows.map((row) => renderRow(row))
                )
              ) : (
                <DataTableEmptyState columnCount={columns.length}>
                  {emptyState}
                </DataTableEmptyState>
              )}
            </TableBody>
          </table>
        </div>
      </div>
      {showPagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          pagination={pagination}
          showGoToPage={showGoToPage}
          showRowRange={showRowRange}
        />
      )}
    </div>
  );
}

// Re-export reusable components for flexibility
export { DataTableBodyCell } from "@/components/modules/data-table//data-table-body-cell";
export { DataTableColumnCell } from "@/components/modules/data-table//data-table-column-cell";
export { DataTableColumnHeader } from "@/components/modules/data-table//data-table-column-header";
export {
  createActionsColumn,
  createExpandColumn,
  createIndexColumn,
  createSelectColumn,
} from "@/components/modules/data-table//data-table-column-helpers";
export { DataTableEmptyState } from "@/components/modules/data-table//data-table-empty-state";
export { DataTableExpandButton } from "@/components/modules/data-table//data-table-expand-button";
export { DataTableFacetedFilter } from "@/components/modules/data-table//data-table-faceted-filter";
export { DataTableGlobalFilter } from "@/components/modules/data-table//data-table-global-filter";
export { DataTableHeaderCell } from "@/components/modules/data-table//data-table-header-cell";
export { DataTablePagination } from "@/components/modules/data-table//data-table-pagination";
export { DataTableRangeFilter } from "@/components/modules/data-table//data-table-range-filter";
export {
  DataTableRowCheckbox,
  DataTableSelectAllCheckbox,
} from "@/components/modules/data-table//data-table-row-checkbox";
export { DataTableSkeletonRows } from "@/components/modules/data-table//data-table-skeleton";
export { DataTableToolbar } from "@/components/modules/data-table//data-table-toolbar";
export { DataTableViewOptions } from "@/components/modules/data-table//data-table-view-options";

// Re-export types for convenience
export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  DataTableProps,
  ExpandedState,
  FilterFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from "@/lib/types/data-table/data-table-types";

// Re-export filter functions for custom filter implementations
export {
  containsFilter,
  dataTableFilterFns,
  dateRangeFilter,
  fuzzyFilter,
  fuzzySort,
  multiSelectFilter,
  numberRangeFilter,
} from "@/lib/data-table/filter-fns";
