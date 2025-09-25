"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { TabsContent } from "@/components/ui/tabs";
import DashboardViews from "./DashboardViews";
import AppViews from "./AppViews";
import PageViews from "./PageViews";
import SettingsViews from "./SettingsViews";

const tabs = [
  {
    id: "dashboards",
    label: "Dashboards",
    iconName: "BarChart3",
  },
  {
    id: "apps",
    label: "Apps",
    iconName: "Globe",
  },
  {
    id: "pages",
    label: "Pages",
    iconName: "FileText",
  },
  {
    id: "settings",
    label: "Settings",
    iconName: "Settings",
  },
];

export default function PageTabs() {
  return (
    <div className="max-w-7xl mx-auto">
      <TabsWithIcons
        tabs={tabs}
        variant="underline"
        className="!w-full border bg-card rounded-lg p-8"
        grid="!grid !grid-cols-4"
      >
        <TabsContent value="dashboards" className="!pt-8">
          <DashboardViews />
        </TabsContent>

        <TabsContent value="apps" className="!pt-8">
          <AppViews />
        </TabsContent>

        <TabsContent value="pages" className="!pt-8">
          <PageViews />
        </TabsContent>

        <TabsContent value="settings" className="!pt-8">
          <SettingsViews />
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}
