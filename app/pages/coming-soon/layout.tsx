/**
 * Coming Soon Layout Component
 * Root layout for coming soon pages providing consistent navigation and sidebar structure
 * Wraps coming soon pages with sidebar navigation and header components
 * Provides standard app layout with sidebar and main content area
 * @param children - The coming soon page content to be rendered within the layout
 * @returns The complete layout structure for coming soon pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * ComingSoonLayout component for coming soon pages
 * Provides a sidebar layout with header and main content area
 * Wraps all coming soon pages with consistent navigation structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the coming soon layout
 */
export default function ComingSoonLayout({
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
