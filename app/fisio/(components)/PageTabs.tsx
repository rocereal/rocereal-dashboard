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
      <div className="flex flex-col text-start py-8 gap-2">
        <h2 className="text-base">Built-In Pages for Every Use Case</h2>
        <p className="text-xl text-muted-foreground">
          Packed with dashboards, apps, auth, and utility pages — fully
          responsive and customizable out of the box.
        </p>
      </div>
      <TabsWithIcons
        tabs={tabs}
        variant="underline"
        className="!w-full bg-transparent rounded-lg"
        grid="!grid !grid-cols-4"
      >
        <TabsContent value="dashboards" className="!pt-8 cursor-pointer">
          <DashboardViews />
        </TabsContent>

        <TabsContent value="apps" className="!pt-8 cursor-pointer">
          <AppViews />
        </TabsContent>

        <TabsContent value="pages" className="!pt-8 cursor-pointer">
          <PageViews />
        </TabsContent>

        <TabsContent value="settings" className="!pt-8 cursor-pointer">
          <SettingsViews />
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}
