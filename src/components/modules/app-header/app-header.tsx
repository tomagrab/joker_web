"use client";

import ModeToggle from "@/components/modules/mode/mode-toggle/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/breadcrumbs/use-breadcrumbs";
import { BreadcrumbTrail } from "../dynamic/breadcrumbs/dynamic-breadcrumbs";

type AppHeaderProps = Readonly<{
  appHeader?: string;
}>;

export default function AppHeader({
  appHeader = "App Header",
}: AppHeaderProps) {
  const { items, showParentButton, parentButtonLabel } = useBreadcrumbs();

  return (
    <header className="flex shrink-0 flex-row items-center border-b p-4">
      <div className="flex flex-1 flex-row items-center justify-start gap-4">
        <SidebarTrigger />
        <BreadcrumbTrail
          items={items}
          showParentButton={showParentButton}
          parentButtonLabel={parentButtonLabel}
          className="min-w-0"
        />
      </div>
      <div className="flex flex-1 flex-row items-center justify-center">
        <h1>{appHeader}</h1>
      </div>
      <div className="flex flex-1 flex-row items-center justify-end">
        <ModeToggle />
      </div>
    </header>
  );
}
