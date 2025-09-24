/**
 * Invoice Layout Component
 * Root layout for invoice pages providing consistent navigation and sidebar structure
 * Wraps invoice pages with sidebar navigation and header components
 * Provides standard app layout with sidebar and main content area for invoice management
 * @param children - The invoice page content to be rendered within the layout
 * @returns The complete layout structure for invoice pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * InvoiceLayout component for invoice pages
 * Provides a sidebar layout with header and main content area
 * Wraps all invoice pages with consistent navigation structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the invoice layout
 */
export default function InvoiceLayout({
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
