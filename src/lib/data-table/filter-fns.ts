import {
  compareItems,
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table";

/**
 * Fuzzy filter function for use with TanStack Table.
 * Uses match-sorter-utils to rank and filter rows based on approximate matches.
 *
 * This filter is especially useful for global filtering where you want to
 * match partial strings and rank results by relevance.
 *
 * @example
 * ```tsx
 * const table = useReactTable({
 *   filterFns: { fuzzy: fuzzyFilter },
 *   globalFilterFn: "fuzzy",
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item based on how well it matches the filter value
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the ranking info in meta for potential sorting use
  addMeta({ itemRank });

  // Return whether the item passed the ranking threshold
  return itemRank.passed;
};

// Remove filter when value is empty
fuzzyFilter.autoRemove = (val: unknown) => !val;

/**
 * Fuzzy sorting function for use with TanStack Table.
 * Sorts rows by their fuzzy match ranking, with fallback to alphanumeric sorting.
 *
 * Should be used in conjunction with fuzzyFilter when you want to sort
 * filtered results by relevance.
 *
 * @example
 * ```tsx
 * const column = {
 *   filterFn: "fuzzy",
 *   sortingFn: fuzzySort,
 * };
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information from fuzzy filtering
  // Type assertion needed because itemRank is added via addMeta in fuzzyFilter
  const metaA = rowA.columnFiltersMeta[columnId] as
    | { itemRank?: RankingInfo }
    | undefined;
  const metaB = rowB.columnFiltersMeta[columnId] as
    | { itemRank?: RankingInfo }
    | undefined;
  const rankA = metaA?.itemRank;
  const rankB = metaB?.itemRank;

  if (rankA && rankB) {
    dir = compareItems(rankA, rankB);
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

/**
 * Filter function that checks if a value is included in an array of selected values.
 * Useful for faceted filtering with multiple selection (checkboxes).
 *
 * @example
 * ```tsx
 * const column = {
 *   accessorKey: "status",
 *   filterFn: "arrIncludesSome", // or use multiSelectFilter
 * };
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const multiSelectFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue || filterValue.length === 0) {
    return true;
  }
  const cellValue = row.getValue(columnId);
  return filterValue.includes(String(cellValue));
};

// Remove filter when array is empty
multiSelectFilter.autoRemove = (val: unknown) =>
  !val || (Array.isArray(val) && val.length === 0);

/**
 * Filter function for number range filtering.
 * Checks if a numeric value falls within a specified range.
 *
 * @example
 * ```tsx
 * const column = {
 *   accessorKey: "age",
 *   filterFn: numberRangeFilter,
 * };
 * // Filter value: [min, max] e.g., [18, 65]
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const numberRangeFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue: [number | undefined, number | undefined],
) => {
  const value = row.getValue<number>(columnId);
  const [min, max] = filterValue ?? [];

  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;

  return true;
};

numberRangeFilter.autoRemove = (val: unknown) =>
  !val || (Array.isArray(val) && val[0] === undefined && val[1] === undefined);

/**
 * Filter function for date range filtering.
 * Checks if a date value falls within a specified range.
 *
 * @example
 * ```tsx
 * const column = {
 *   accessorKey: "createdAt",
 *   filterFn: dateRangeFilter,
 * };
 * // Filter value: [startDate, endDate]
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateRangeFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue: [Date | undefined, Date | undefined],
) => {
  const value = row.getValue<Date | string | number>(columnId);
  const [startDate, endDate] = filterValue ?? [];

  if (!value) return false;

  const date = value instanceof Date ? value : new Date(value);

  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;

  return true;
};

dateRangeFilter.autoRemove = (val: unknown) =>
  !val || (Array.isArray(val) && val[0] === undefined && val[1] === undefined);

/**
 * Case-insensitive string containment filter with trimming.
 * More forgiving than the default includesString filter.
 *
 * @example
 * ```tsx
 * const column = {
 *   accessorKey: "name",
 *   filterFn: containsFilter,
 * };
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const containsFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue<string>(columnId);
  if (!value) return false;

  return value
    .toString()
    .toLowerCase()
    .trim()
    .includes(String(filterValue).toLowerCase().trim());
};

containsFilter.autoRemove = (val: unknown) =>
  !val || (typeof val === "string" && val.trim() === "");

/**
 * Default filter functions map for easy registration with TanStack Table.
 *
 * @example
 * ```tsx
 * const table = useReactTable({
 *   filterFns: dataTableFilterFns,
 * });
 * ```
 */
export const dataTableFilterFns = {
  fuzzy: fuzzyFilter,
  multiSelect: multiSelectFilter,
  numberRange: numberRangeFilter,
  dateRange: dateRangeFilter,
  contains: containsFilter,
} as const;

export type DataTableFilterFnKey = keyof typeof dataTableFilterFns;
