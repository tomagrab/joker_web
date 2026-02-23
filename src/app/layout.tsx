import AppFooter from "@/components/modules/app-footer/app-footer";
import AppHeader from "@/components/modules/app-header/app-header";
import AppSidebar from "@/components/modules/app-sidebar/app-sidebar";
import AppChatWidgetDnDProvider from "@/components/providers/app-chat-widget-dnd/app-chat-widget-dnd-provider";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const sidebarVariant = (cookieStore.get("sidebar_variant")?.value ||
    "inset") as "sidebar" | "floating" | "inset";
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

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
          <AppChatWidgetDnDProvider>
            <SidebarProvider
              defaultOpen={sidebarOpen}
              className="h-svh max-h-svh! min-h-svh!"
            >
              <AppSidebar variant={sidebarVariant} />
              {sidebarVariant === "inset" ? (
                <SidebarInset className="min-h-0 overflow-hidden">
                  <TooltipProvider>
                    <AppHeader />
                    <main className="min-h-0 flex-1 overflow-auto">
                      {children}
                    </main>
                    <AppFooter />
                  </TooltipProvider>
                </SidebarInset>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <TooltipProvider>
                    <AppHeader />
                    <main className="min-h-0 flex-1 overflow-auto">
                      {children}
                    </main>
                    <AppFooter />
                  </TooltipProvider>
                </div>
              )}
            </SidebarProvider>
          </AppChatWidgetDnDProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
