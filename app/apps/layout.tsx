/**
 * Layout for Apps Pages
 * This layout wraps the apps page content with configurable sidebar/header navigation
 * Provides navigation and structure for app sections that respects user layout preferences
 * @param children - The page content
 * @returns The layout structure for apps pages
 */

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ConfigurableLayout } from "@/components/shared/configurable-layout";

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigurableLayout header={<AppHeader />} sidebar={<AppSidebar />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8">{children}</div>
    </ConfigurableLayout>
  );
}
