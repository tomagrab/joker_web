import BreadcrumbsContext from "@/components/contexts/breadcrumbs/breadcrumbs-context";
import { useContext } from "react";

export function useBreadcrumbs() {
	return useContext(BreadcrumbsContext);
}