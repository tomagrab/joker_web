"use client";

import { PaginationState, Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  /**
   * Controlled pagination state from parent component.
   * When provided, ensures proper React re-rendering when pagination changes.
   */
  pagination?: PaginationState;
  /**
   * Show "Go to page" input for direct page navigation (default: false)
   */
  showGoToPage?: boolean;
  /**
   * Show row selection count (default: true)
   */
  showSelectedCount?: boolean;
  /**
   * Show row range info "Showing X-Y of Z" (default: false)
   */
  showRowRange?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  pagination: controlledPagination,
  showGoToPage = false,
  showSelectedCount = true,
  showRowRange = false,
}: DataTablePaginationProps<TData>) {
  // Use controlled pagination if provided, otherwise fall back to table state
  const paginationState = controlledPagination ?? table.getState().pagination;
  const { pageSize, pageIndex } = paginationState;

  // Calculate page count based on total rows and page size
  const totalRowCount = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(1, Math.ceil(totalRowCount / pageSize));

  // Calculate navigation availability based on controlled state
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  // Calculate row range for current page
  const startRow = totalRowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRowCount);

  // Local state for "go to page" input
  const [goToPageValue, setGoToPageValue] = React.useState("");

  // Handle "go to page" submission
  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = Number(goToPageValue);
    if (page >= 1 && page <= pageCount) {
      table.setPageIndex(page - 1);
      setGoToPageValue("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
      <div className="text-muted-foreground flex-1 text-sm">
        {showSelectedCount && (
          <span>
            {selectedRowCount} of {totalRowCount} row(s) selected.
          </span>
        )}
        {showRowRange && (
          <span>
            {showSelectedCount && " • "}
            Showing {startRow}-{endRow} of {totalRowCount} rows
          </span>
        )}
        {!showSelectedCount && !showRowRange && (
          <span>{totalRowCount} row(s)</span>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showGoToPage && (
          <form onSubmit={handleGoToPage} className="flex items-center gap-2">
            <p className="text-sm font-medium">Go to</p>
            <Input
              type="number"
              min={1}
              max={pageCount}
              value={goToPageValue}
              onChange={(e) => setGoToPageValue(e.target.value)}
              placeholder={String(pageIndex + 1)}
              className="h-8 w-14 text-center"
            />
          </form>
        )}
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.firstPage()}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.lastPage()}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
