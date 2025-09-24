/**
 * Errors Layout Component
 * Root layout for error pages providing consistent navigation and sidebar structure
 * Wraps error pages with sidebar navigation and header components
 * Provides standard app layout with sidebar and main content area for error sections
 * @param children - The error page content to be rendered within the layout
 * @returns The complete layout structure for error pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * ErrorsLayout component for error pages
 * Provides a sidebar layout with header and main content area
 * Wraps all error pages with consistent navigation structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the errors layout
 */
export default function ErrorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
