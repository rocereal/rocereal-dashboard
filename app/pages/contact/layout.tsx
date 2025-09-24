/**
 * Contact Layout Component
 * Root layout for contact pages providing consistent navigation and sidebar structure
 * Wraps contact pages with sidebar navigation and header components
 * Provides standard app layout with sidebar and main content area for contact sections
 * @param children - The contact page content to be rendered within the layout
 * @returns The complete layout structure for contact pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * ContactLayout component for contact pages
 * Provides a sidebar layout with header and main content area
 * Wraps all contact pages with consistent navigation structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the contact layout
 */
export default function ContactLayout({
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
