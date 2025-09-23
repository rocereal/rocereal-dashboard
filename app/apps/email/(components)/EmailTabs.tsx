"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { emailTabs } from "@/data/email";

/**
 * Props for EmailTabs component
 * @param selectedTab - The currently selected tab ID
 * @param onTabChange - Callback function when tab selection changes
 * @param tabCounts - Object containing email counts for each tab
 */
interface EmailTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  tabCounts: Record<string, number>;
}

/**
 * Email Tabs Component
 * Displays navigation tabs for different email views with dynamic counts
 * Uses TabsWithIcons component to show inbox, sent, drafts, etc. with email counts
 * Responsive design that adapts to different screen sizes
 * @param selectedTab - The currently selected tab ID
 * @param onTabChange - Callback function when tab selection changes
 * @param tabCounts - Object containing email counts for each tab
 * @returns The JSX element representing the email navigation tabs
 */
export default function EmailTabs({
  selectedTab,
  onTabChange,
  tabCounts,
}: EmailTabsProps) {
  return (
    <div className="px-8 py-4 lg:py-0">
      <TabsWithIcons
        tabs={emailTabs.map((tab) => ({
          ...tab,
          count: tabCounts[tab.id as keyof typeof tabCounts],
        }))}
        defaultValue={selectedTab}
        onValueChange={onTabChange}
        variant="underline"
        className="!w-full lg:!w-full px-2"
        grid="!grid !grid-cols-4"
      />
    </div>
  );
}
