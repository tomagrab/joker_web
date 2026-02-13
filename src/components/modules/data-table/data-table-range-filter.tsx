"use client";

import { Column } from "@tanstack/react-table";
import { SlidersHorizontalIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface DataTableRangeFilterProps<TData, TValue> {
  /**
   * The column to filter
   */
  column?: Column<TData, TValue>;
  /**
   * The title/label for the filter
   */
  title?: string;
  /**
   * Number of decimal places to display (default: 0)
   */
  decimalPlaces?: number;
  /**
   * Step value for the slider (default: 1)
   */
  step?: number;
  /**
   * Format function for displaying values
   */
  formatValue?: (value: number) => string;
  /**
   * Whether to show the slider (default: true)
   */
  showSlider?: boolean;
  /**
   * Whether to show input fields (default: true)
   */
  showInputs?: boolean;
  /**
   * Additional class name for the popover content
   */
  className?: string;
}

/**
 * Range filter component that uses column faceting to determine min/max values.
 * Supports both slider and input-based filtering for numeric columns.
 *
 * Uses `getFacetedMinMaxValues()` from TanStack Table to automatically
 * determine the range of values in the column.
 *
 * @example
 * ```tsx
 * <DataTableRangeFilter
 *   column={table.getColumn("age")}
 *   title="Age"
 *   step={1}
 * />
 * ```
 */
export function DataTableRangeFilter<TData, TValue>({
  column,
  title,
  decimalPlaces = 0,
  step = 1,
  formatValue,
  showSlider = true,
  showInputs = true,
  className,
}: DataTableRangeFilterProps<TData, TValue>) {
  // Get min/max from faceted values
  const facetedMinMax = column?.getFacetedMinMaxValues();
  const [facetedMin, facetedMax] = facetedMinMax ?? [0, 100];

  // Current filter value
  const filterValue = column?.getFilterValue() as
    | [number | undefined, number | undefined]
    | undefined;
  const [min, max] = filterValue ?? [undefined, undefined];

  // Local state for inputs (to allow typing before applying)
  const [localMin, setLocalMin] = React.useState<string>(min?.toString() ?? "");
  const [localMax, setLocalMax] = React.useState<string>(max?.toString() ?? "");

  // Sync local state with filter value
  React.useEffect(() => {
    setLocalMin(min?.toString() ?? "");
    setLocalMax(max?.toString() ?? "");
  }, [min, max]);

  const hasFilter = min !== undefined || max !== undefined;

  const handleSliderChange = (values: number[]) => {
    const [newMin, newMax] = values;
    // Only set filter if values differ from faceted bounds
    const minVal = newMin === facetedMin ? undefined : newMin;
    const maxVal = newMax === facetedMax ? undefined : newMax;

    if (minVal === undefined && maxVal === undefined) {
      column?.setFilterValue(undefined);
    } else {
      column?.setFilterValue([minVal, maxVal]);
    }
  };

  const handleInputBlur = () => {
    const minVal = localMin ? parseFloat(localMin) : undefined;
    const maxVal = localMax ? parseFloat(localMax) : undefined;

    if (minVal === undefined && maxVal === undefined) {
      column?.setFilterValue(undefined);
    } else {
      column?.setFilterValue([minVal, maxVal]);
    }
  };

  const handleClear = () => {
    column?.setFilterValue(undefined);
    setLocalMin("");
    setLocalMax("");
  };

  const format = (value: number) => {
    if (formatValue) return formatValue(value);
    return decimalPlaces > 0 ? value.toFixed(decimalPlaces) : value.toString();
  };

  const displayValue = () => {
    if (!hasFilter) return null;
    const parts: string[] = [];
    if (min !== undefined) parts.push(`≥ ${format(min)}`);
    if (max !== undefined) parts.push(`≤ ${format(max)}`);
    return parts.join(" ");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <SlidersHorizontalIcon className="mr-2 size-4" />
          {title}
          {hasFilter && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {displayValue()}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-72", className)} align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm leading-none font-medium">{title}</h4>
              <span className="text-muted-foreground text-xs">
                {format(facetedMin)} - {format(facetedMax)}
              </span>
            </div>
          </div>

          {showSlider && (
            <Slider
              min={facetedMin}
              max={facetedMax}
              step={step}
              value={[min ?? facetedMin, max ?? facetedMax]}
              onValueChange={handleSliderChange}
              className="py-2"
            />
          )}

          {showInputs && (
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="min-input" className="text-xs">
                  Min
                </Label>
                <Input
                  id="min-input"
                  type="number"
                  placeholder={format(facetedMin)}
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInputBlur();
                  }}
                  min={facetedMin}
                  max={facetedMax}
                  step={step}
                  className="h-8"
                />
              </div>
              <div className="text-muted-foreground mt-5">—</div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="max-input" className="text-xs">
                  Max
                </Label>
                <Input
                  id="max-input"
                  type="number"
                  placeholder={format(facetedMax)}
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInputBlur();
                  }}
                  min={facetedMin}
                  max={facetedMax}
                  step={step}
                  className="h-8"
                />
              </div>
            </div>
          )}

          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={handleClear}
            >
              Clear filter
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
