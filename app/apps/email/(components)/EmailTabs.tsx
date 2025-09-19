"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { emailTabs } from "@/data/email";

interface EmailTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  tabCounts: Record<string, number>;
}

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
