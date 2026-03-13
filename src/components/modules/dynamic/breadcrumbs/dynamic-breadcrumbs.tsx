"use client";

import type { DynamicBreadcrumbItem } from "@/components/contexts/breadcrumbs/breadcrumbs-context";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useId } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useBreadcrumbs } from "@/hooks/breadcrumbs/use-breadcrumbs";
import { cn } from "@/lib/utils";

type DynamicBreadcrumbsProps = Readonly<{
  items: readonly DynamicBreadcrumbItem[];
  showParentButton?: boolean;
  parentButtonLabel?: string;
}>;

type BreadcrumbTrailProps = Readonly<
  DynamicBreadcrumbsProps & {
    className?: string;
  }
>;

export function BreadcrumbTrail({
  items,
  className,
  showParentButton = false,
  parentButtonLabel = "Prev",
}: BreadcrumbTrailProps) {
  if (items.length === 0) {
    return null;
  }

  const currentIndex = items.length - 1;
  const parentItem =
    showParentButton && currentIndex > 0 ? items[currentIndex - 1] : null;

  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>
      {parentItem ? (
        <Button asChild variant="ghost" size="sm" className="h-auto px-2">
          <Link
            href={parentItem.href}
            aria-label={`Back to ${parentItem.label}`}
          >
            <ChevronLeft className="size-4" />
            <span>{parentButtonLabel}</span>
          </Link>
        </Button>
      ) : null}

      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <Fragment key={`${item.href}-${item.label}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {index === currentIndex ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default function DynamicBreadcrumbs({
  items,
  showParentButton = false,
  parentButtonLabel = "Prev",
}: DynamicBreadcrumbsProps) {
  const breadcrumbId = useId();
  const { registerBreadcrumbs, unregisterBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    registerBreadcrumbs(breadcrumbId, {
      items,
      showParentButton,
      parentButtonLabel,
    });

    return () => {
      unregisterBreadcrumbs(breadcrumbId);
    };
  }, [
    breadcrumbId,
    items,
    parentButtonLabel,
    registerBreadcrumbs,
    showParentButton,
    unregisterBreadcrumbs,
  ]);

  return null;
}
