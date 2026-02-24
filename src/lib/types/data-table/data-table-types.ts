import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  FilterFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

/**
 * Meta object passed through TanStack Table's options.meta
 * for sharing state and handlers with child components
 */
export interface DataTableMeta {
  /**
   * Pin a column to left, right, or unpin it
   */
  pinColumn: (columnId: string, position: "left" | "right" | false) => void;
  /**
   * Current column pinning state (for React reactivity)
   */
  columnPinning: ColumnPinningState;
  /**
   * Check if a column is a fixed column (select/actions) that cannot be unpinned
   */
  isFixedColumn: (columnId: string) => boolean;
}

/**
 * Type guard to check if meta is DataTableMeta
 */
export function isDataTableMeta(meta: unknown): meta is DataTableMeta {
  return (
    typeof meta === "object" &&
    meta !== null &&
    "pinColumn" in meta &&
    "columnPinning" in meta &&
    "isFixedColumn" in meta
  );
}

// ============================================================================
// DataTable Props
// ============================================================================

export interface DataTableProps<TData, TValue> {
  // ==================== Core Props ====================

  /**
   * The column definitions for the table
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * The data to display in the table
   */
  data: TData[];
  /**
   * Additional table options to pass to useReactTable (optional)
   */
  tableOptions?: Partial<TableOptions<TData>>;
  /**
   * Additional class name for the container
   */
  className?: string;

  // ==================== UI Display Props ====================

  /**
   * Whether to show the toolbar (default: true)
   */
  showToolbar?: boolean;
  /**
   * Whether to show pagination (default: true)
   */
  showPagination?: boolean;
  /**
   * Whether data is loading (shows skeleton rows)
   */
  isLoading?: boolean;
  /**
   * Number of skeleton rows to show when loading (default: 5)
   */
  loadingRowCount?: number;
  /**
   * Custom empty state content when no results
   */
  emptyState?: React.ReactNode;

  // ==================== Toolbar Props ====================

  /**
   * Custom content for the left side of the toolbar (after filter)
   */
  toolbarLeftContent?: React.ReactNode;
  /**
   * Render function for toolbar left content that receives the table instance.
   * Useful for faceted filters that need access to column data.
   * Takes precedence over toolbarLeftContent when both are provided.
   */
  renderToolbarLeftContent?: (table: Table<TData>) => React.ReactNode;
  /**
   * Custom content for the right side of the toolbar (before view options)
   */
  toolbarRightContent?: React.ReactNode;
  /**
   * Render function for toolbar right content that receives the table instance.
   */
  renderToolbarRightContent?: (table: Table<TData>) => React.ReactNode;

  // ==================== Pagination Props ====================

  /**
   * Page size options for pagination (optional)
   */
  pageSizeOptions?: number[];
  /**
   * Initial page size (default: 10)
   */
  initialPageSize?: number;
  /**
   * Enable manual/server-side pagination (default: false)
   * When true, the table will not apply any pagination logic
   */
  manualPagination?: boolean;
  /**
   * Callback when pagination state changes
   */
  onPaginationChange?: (pagination: PaginationState) => void;
  /**
   * Total row count for server-side pagination
   * Required when manualPagination is true
   */
  rowCount?: number;
  /**
   * Auto reset page index when data/filters change (default: true for client-side pagination)
   * Set to false to preserve page index across data changes
   */
  autoResetPageIndex?: boolean;
  /**
   * Show "Go to page" input in pagination (default: false)
   */
  showGoToPage?: boolean;
  /**
   * Show row range info "Showing X-Y of Z" in pagination (default: false)
   */
  showRowRange?: boolean;

  // ==================== Sorting Props ====================

  /**
   * Enable sorting for the table (default: true)
   */
  enableSorting?: boolean;
  /**
   * Initial sorting state
   * Example: [{ id: 'name', desc: false }]
   */
  initialSorting?: SortingState;
  /**
   * Callback when sorting state changes
   */
  onSortingChange?: (sorting: SortingState) => void;
  /**
   * Enable manual/server-side sorting (default: false)
   * When true, the table will not apply any sorting logic
   */
  manualSorting?: boolean;
  /**
   * Enable multi-column sorting (default: true)
   * When true, users can hold Shift to sort by multiple columns
   */
  enableMultiSort?: boolean;
  /**
   * Enable removal of sorting (default: true)
   * When false, once a column is sorted, clicking again only toggles direction
   */
  enableSortingRemoval?: boolean;
  /**
   * Maximum number of columns that can be sorted at once
   * Only applies when enableMultiSort is true
   */
  maxMultiSortColCount?: number;

  // ==================== Filtering Props ====================

  /**
   * Enable global filtering with fuzzy search (default: false)
   */
  enableGlobalFilter?: boolean;
  /**
   * Placeholder text for global filter input
   */
  globalFilterPlaceholder?: string;
  /**
   * Debounce delay for global filter in milliseconds (default: 300)
   */
  globalFilterDebounceMs?: number;
  /**
   * Custom global filter function (defaults to fuzzy filter)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalFilterFn?: FilterFn<any> | string;
  /**
   * Initial global filter value
   */
  initialGlobalFilter?: string;
  /**
   * Initial column filters state
   */
  initialColumnFilters?: ColumnFiltersState;
  /**
   * Callback when global filter changes
   */
  onGlobalFilterChange?: (value: string) => void;
  /**
   * Callback when column filters change
   */
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  /**
   * Enable manual/server-side filtering (default: false)
   * When true, the table will not apply any filtering logic
   */
  manualFiltering?: boolean;
  /**
   * Start filtering from leaf rows and work up (default: false)
   */
  filterFromLeafRows?: boolean;
  /**
   * Maximum depth of leaf rows to filter (default: 100)
   */
  maxLeafRowFilterDepth?: number;

  // ==================== Column Visibility Props ====================

  /**
   * Initial column visibility state
   * Keys are column IDs, values are boolean (true = visible)
   */
  initialColumnVisibility?: VisibilityState;
  /**
   * Callback when column visibility changes
   */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;

  // ==================== Column Ordering Props ====================

  /**
   * Enable column reordering via drag and drop (default: false)
   */
  enableColumnOrdering?: boolean;

  // ==================== Column Pinning Props ====================

  /**
   * Enable column pinning (default: false)
   */
  enableColumnPinning?: boolean;
  /**
   * Initial column pinning state (optional)
   */
  initialColumnPinning?: ColumnPinningState;
  /**
   * Column IDs that are fixed (cannot be unpinned or reordered)
   * Defaults to ["select", "actions", "expand"]
   */
  fixedColumnIds?: string[];

  // ==================== Row Selection Props ====================

  /**
   * Enable row selection (default: true)
   * Can be a boolean or a function that receives the row and returns a boolean
   */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /**
   * Enable multi-row selection (default: true)
   * Set to false for single-row selection (radio button behavior)
   * Can be a function for conditional multi-select on sub-rows
   */
  enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /**
   * Enable sub-row selection when parent is selected (default: true)
   * Set to false to disable automatic sub-row selection
   */
  enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /**
   * Initial row selection state
   * Keys are row IDs, values are boolean (true = selected)
   */
  initialRowSelection?: RowSelectionState;
  /**
   * Callback when row selection changes (optional)
   */
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /**
   * Custom function to generate row IDs
   * Useful for using database IDs instead of row indices
   */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  // ==================== Row Expanding Props ====================

  /**
   * Enable row expanding (default: false)
   */
  enableExpanding?: boolean;
  /**
   * Function to extract sub-rows from data (for hierarchical data)
   */
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  /**
   * Function to determine if a row can be expanded (default: checks for sub-rows)
   */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /**
   * Initial expanded state
   */
  initialExpanded?: ExpandedState;
  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: ExpandedState) => void;
  /**
   * Whether expanded rows should be paginated (default: true)
   * When false, expanded rows will always render on their parent's page
   */
  paginateExpandedRows?: boolean;
  /**
   * Render function for custom expanded content (detail panels).
   * When provided, this content will be rendered below expanded rows.
   */
  renderExpandedContent?: (row: Row<TData>) => React.ReactNode;
  /**
   * Enable manual/server-side expanding (default: false)
   */
  manualExpanding?: boolean;

  // ==================== Row Interaction Props ====================

  /**
   * Callback when a row is clicked
   */
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
  /**
   * Callback when a row is double-clicked
   */
  onRowDoubleClick?: (row: Row<TData>, event: React.MouseEvent) => void;

  // ==================== Virtualization Props ====================

  /**
   * Enable row virtualization for large datasets (default: false)
   * When enabled, only visible rows are rendered for improved performance.
   * Recommended for tables with 500+ rows.
   */
  enableVirtualization?: boolean;
  /**
   * Estimated height of each row in pixels (default: 40)
   * Used by the virtualizer to calculate scroll position.
   * For best performance, set this close to your actual row height.
   */
  estimatedRowHeight?: number;
  /**
   * Number of rows to render outside the visible area (default: 5)
   * Higher values provide smoother scrolling but use more memory.
   */
  overscan?: number;
  /**
   * Height of the virtualized table container.
   * Required when virtualization is enabled.
   * Can be a number (pixels) or CSS string (e.g., "500px", "calc(100vh - 200px)")
   */
  virtualTableHeight?: number | string;
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  FilterFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
