"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface DataTableColumnCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Visual variant of the cell content
   */
  variant?: "default" | "muted" | "medium";
}

export function DataTableColumnCell({
  children,
  className,
  variant = "default",
  ...props
}: DataTableColumnCellProps) {
  return (
    <div
      className={cn(
        variant === "muted" && "text-muted-foreground",
        variant === "medium" && "font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
