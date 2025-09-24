import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * Layout for Dashboard Pages
 * This layout wraps the dashboard page content with sidebar and header
 * Provides navigation structure for dashboard sections
 * @param children - The page content
 * @returns The layout structure for dashboard pages
 */
export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
