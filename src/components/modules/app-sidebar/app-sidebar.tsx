import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

type AppSidebarProps = Readonly<{
  variant?: "sidebar" | "floating" | "inset";
}>;

export default function AppSidebar({ variant = "inset" }: AppSidebarProps) {
  return (
    <Sidebar variant={variant}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
