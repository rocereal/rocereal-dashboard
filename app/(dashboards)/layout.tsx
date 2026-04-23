import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ConfigurableLayout } from "@/components/shared/configurable-layout";

/**
 * Layout for Dashboard Pages
 * This layout wraps the dashboard page content with configurable sidebar/header navigation
 * Provides navigation structure for dashboard sections that respects user layout preferences
 * @param children - The page content
 * @returns The layout structure for dashboard pages
 */
export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigurableLayout header={<AppHeader />} sidebar={<AppSidebar />}>
      <div className="flex flex-col gap-4 p-4 pt-8">
        {children}
      </div>
    </ConfigurableLayout>
  );
}
