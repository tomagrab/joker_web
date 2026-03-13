import AppFooter from "@/components/modules/app-footer/app-footer";
import AppHeader from "@/components/modules/app-header/app-header";
import AppSidebar from "@/components/modules/app-sidebar/app-sidebar";
import { AppChatWidgetProvider } from "@/components/providers/app-chat-widget-context-provider/app-chat-widget-context-provider";
import AppChatWidgetDnDProvider from "@/components/providers/app-chat-widget-dnd/app-chat-widget-dnd-provider";
import { AppPreferencesProvider } from "@/components/providers/app-preferences/app-preferences-provider";
import { BreadcrumbsProvider } from "@/components/providers/breadcrumbs/breadcrumbs-provider";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { loadUserPreferences } from "@/lib/server/user-preferences/user-preferences-server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joker Web",
  description: "An app for jokes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialPreferences = await loadUserPreferences();

  return (
    <html lang="en" className="h-full overflow-hidden" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppPreferencesProvider initialPreferences={initialPreferences}>
            <AppChatWidgetProvider>
              <AppChatWidgetDnDProvider>
                <SidebarProvider
                  defaultOpen={initialPreferences.sidebar.open}
                  className="h-svh max-h-svh! min-h-svh!"
                >
                  <AppSidebar variant={initialPreferences.sidebar.variant} />
                  {initialPreferences.sidebar.variant === "inset" ? (
                    <SidebarInset className="border-gold min-h-0 overflow-hidden border">
                      <TooltipProvider>
                        <BreadcrumbsProvider>
                          <AppHeader />
                          <main className="min-h-0 flex-1 overflow-auto">
                            {children}
                          </main>
                          <AppFooter />
                        </BreadcrumbsProvider>
                      </TooltipProvider>
                    </SidebarInset>
                  ) : (
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                      <TooltipProvider>
                        <BreadcrumbsProvider>
                          <AppHeader />
                          <main className="min-h-0 flex-1 overflow-auto">
                            {children}
                          </main>
                          <AppFooter />
                        </BreadcrumbsProvider>
                      </TooltipProvider>
                    </div>
                  )}
                </SidebarProvider>
              </AppChatWidgetDnDProvider>
            </AppChatWidgetProvider>
          </AppPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
