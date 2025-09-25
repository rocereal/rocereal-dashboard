/**
 * Settings Layout Component
 * Root layout for settings pages providing consistent navigation and sidebar structure
 * Wraps settings pages with sidebar navigation and header components
 * Provides standard app layout with sidebar and main content area for settings sections
 * @param children - The settings page content to be rendered within the layout
 * @returns The complete layout structure for settings pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ConfigurableLayout } from "@/components/shared/configurable-layout";

/**
 * SettingsLayout component for settings pages
 * Provides a sidebar layout with header and main content area
 * Wraps all settings pages with consistent navigation structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the settings layout
 */

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigurableLayout header={<AppHeader />} sidebar={<AppSidebar />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8">{children}</div>
    </ConfigurableLayout>
  );
}
