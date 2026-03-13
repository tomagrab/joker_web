import { createContext } from "react";

export type DynamicBreadcrumbItem = Readonly<{
  label: string;
  href: string;
}>;

export type BreadcrumbRegistration = Readonly<{
  items: readonly DynamicBreadcrumbItem[];
  showParentButton?: boolean;
  parentButtonLabel?: string;
}>;

type BreadcrumbsContextType = {
  items: readonly DynamicBreadcrumbItem[];
  showParentButton: boolean;
  parentButtonLabel: string;
  registerBreadcrumbs: (
    id: string,
    registration: BreadcrumbRegistration,
  ) => void;
  unregisterBreadcrumbs: (id: string) => void;
};

const BreadcrumbsContext = createContext<BreadcrumbsContextType>({
  items: [],
  showParentButton: false,
  parentButtonLabel: "Prev",
  registerBreadcrumbs: () => {},
  unregisterBreadcrumbs: () => {},
});

export default BreadcrumbsContext;
