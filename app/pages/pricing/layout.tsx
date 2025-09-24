/**
 * Pricing Layout Component
 * Root layout for pricing pages providing consistent navigation and sidebar structure
 * Wraps pricing pages with sidebar navigation and header components
 * Provides standard app layout with sidebar and main content area for pricing sections
 * @param children - The pricing page content to be rendered within the layout
 * @returns The complete layout structure for pricing pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * PricingLayout component for pricing pages
 * Provides a sidebar layout with header and main content area
 * Wraps all pricing pages with consistent navigation structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the pricing layout
 */
export default function PricingLayout({
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
