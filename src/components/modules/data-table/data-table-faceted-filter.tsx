"use client";

import { Column } from "@tanstack/react-table";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FacetedFilterOption {
  /**
   * The value used for filtering
   */
  value: string;
  /**
   * The display label for the option
   */
  label: string;
  /**
   * Optional icon to display next to the label
   */
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  /**
   * The column to filter
   */
  column?: Column<TData, TValue>;
  /**
   * The title/label for the filter
   */
  title?: string;
  /**
   * Available filter options. If not provided, options will be auto-generated
   * from the column's faceted unique values.
   */
  options?: FacetedFilterOption[];
  /**
   * Maximum number of auto-generated options to show (default: 100)
   * Only applies when options are auto-generated from faceted values.
   */
  maxAutoOptions?: number;
  /**
   * Format function for auto-generated option labels
   */
  formatLabel?: (value: string) => string;
  /**
   * Maximum number of selected values to display in the trigger
   * @default 2
   */
  maxDisplayedValues?: number;
  /**
   * Placeholder text for the search input
   */
  searchPlaceholder?: string;
  /**
   * Text shown when no options match the search
   */
  emptyText?: string;
}

/**
 * Faceted filter component that uses column faceting for multi-select filtering.
 *
 * Uses `getFacetedUniqueValues()` from TanStack Table to:
 * - Show counts next to each option
 * - Auto-generate options when not explicitly provided
 *
 * @example
 * ```tsx
 * // With explicit options
 * <DataTableFacetedFilter
 *   column={table.getColumn("status")}
 *   title="Status"
 *   options={[
 *     { value: "active", label: "Active" },
 *     { value: "inactive", label: "Inactive" },
 *   ]}
 * />
 *
 * // With auto-generated options from faceted values
 * <DataTableFacetedFilter
 *   column={table.getColumn("category")}
 *   title="Category"
 *   formatLabel={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
 * />
 * ```
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options: providedOptions,
  maxAutoOptions = 100,
  formatLabel,
  maxDisplayedValues = 2,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  // Auto-generate options from faceted unique values if not provided
  const options = React.useMemo((): FacetedFilterOption[] => {
    if (providedOptions) return providedOptions;

    if (!facets) return [];

    // Generate options from faceted values, sorted by count (descending)
    return Array.from(facets.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxAutoOptions)
      .map(([value]) => ({
        value: String(value),
        label: formatLabel ? formatLabel(String(value)) : String(value),
      }));
  }, [providedOptions, facets, maxAutoOptions, formatLabel]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.size > maxDisplayedValues ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="size-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 size-4" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
