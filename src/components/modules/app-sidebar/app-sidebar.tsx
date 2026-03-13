"use client";

import { ChevronRight, Home, Settings, UserIcon, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const primaryNavigation = [
  {
    href: "/",
    label: "Home",
    description: "Random jokes and landing page",
    icon: Home,
    exact: true,
  },
  {
    href: "/tools",
    label: "Tools",
    description: "Utilities and app tooling",
    icon: Wrench,
    exact: false,
  },
] as const;

const settingsNavigation = [
  {
    href: "/tools/settings",
    label: "App settings",
    exact: true,
  },
  {
    href: "/tools/settings/user",
    label: "User settings",
    exact: true,
  },
] as const;

function isRouteActive(pathname: string, href: string, exact = false) {
  if (href === "/") {
    return pathname === "/";
  }

  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type AppSidebarProps = Readonly<{
  variant?: "sidebar" | "floating" | "inset";
}>;

export default function AppSidebar({ variant = "inset" }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isSettingsSectionActive = pathname.startsWith("/tools/settings");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(
    isSettingsSectionActive,
  );

  React.useEffect(() => {
    if (isSettingsSectionActive) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsSectionActive]);

  function handleNavigation() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar variant={variant}>
      <SidebarHeader className="border-sidebar-border/70 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-auto py-2"
              asChild
              tooltip="Go to home"
            >
              <Link href="/" onClick={handleNavigation}>
                <Avatar className="rounded-lg">
                  <AvatarFallback className="bg-primary text-primary-foreground rounded-lg font-semibold">
                    J
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Joker Web</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="text-sidebar-foreground/60 px-2 pb-1 text-xs font-medium tracking-wide uppercase">
            Navigate
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      isActive={isRouteActive(pathname, item.href, item.exact)}
                      tooltip={item.label}
                    >
                      <Link href={item.href} onClick={handleNavigation}>
                        <Icon />
                        <div className="grid flex-1 text-left leading-tight">
                          <span>{item.label}</span>
                          <span className="text-sidebar-foreground/60 truncate text-xs">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <Collapsible
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          className="group/collapsible"
        >
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <button className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium tracking-wide uppercase transition-colors">
                <Settings className="size-3.5" />
                <span className="flex-1">Settings</span>
                <ChevronRight className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="pt-2">
                <SidebarMenuSub>
                  {settingsNavigation.map((item) => (
                    <SidebarMenuSubItem key={item.href}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isRouteActive(
                          pathname,
                          item.href,
                          item.exact,
                        )}
                      >
                        <Link href={item.href} onClick={handleNavigation}>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto py-2"
              isActive={pathname === "/tools/settings/user"}
              tooltip="Open user settings"
            >
              <Link
                className="flex items-center gap-3"
                href="/tools/settings/user"
                onClick={handleNavigation}
              >
                <Avatar size="default">
                  <AvatarFallback>
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">User</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
