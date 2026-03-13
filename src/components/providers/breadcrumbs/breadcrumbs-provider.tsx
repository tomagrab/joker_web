"use client";

import BreadcrumbsContext, {
  type BreadcrumbRegistration,
} from "@/components/contexts/breadcrumbs/breadcrumbs-context";
import { ReactNode, useCallback, useMemo, useState } from "react";

type BreadcrumbsProviderProps = Readonly<{
  children: ReactNode;
}>;

type BreadcrumbEntry = Readonly<{
  id: string;
  registration: BreadcrumbRegistration;
}>;

export function BreadcrumbsProvider({ children }: BreadcrumbsProviderProps) {
  const [entries, setEntries] = useState<readonly BreadcrumbEntry[]>([]);

  const registerBreadcrumbs = useCallback(
    (id: string, registration: BreadcrumbRegistration) => {
      setEntries((currentEntries) => {
        const entryIndex = currentEntries.findIndex((entry) => entry.id === id);

        if (entryIndex === -1) {
          return [...currentEntries, { id, registration }];
        }

        const nextEntries = [...currentEntries];
        nextEntries[entryIndex] = { id, registration };
        return nextEntries;
      });
    },
    [],
  );

  const unregisterBreadcrumbs = useCallback((id: string) => {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== id),
    );
  }, []);

  const activeEntry = entries[entries.length - 1]?.registration;

  const value = useMemo(
    () => ({
      items: activeEntry?.items ?? [],
      showParentButton: activeEntry?.showParentButton ?? false,
      parentButtonLabel: activeEntry?.parentButtonLabel ?? "Prev",
      registerBreadcrumbs,
      unregisterBreadcrumbs,
    }),
    [activeEntry, registerBreadcrumbs, unregisterBreadcrumbs],
  );

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}
