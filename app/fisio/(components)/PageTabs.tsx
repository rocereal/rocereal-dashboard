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
    label: "Dashboard-uri",
    iconName: "BarChart3",
  },
  {
    id: "apps",
    label: "Aplicatii",
    iconName: "Globe",
  },
  {
    id: "pages",
    label: "Pagini",
    iconName: "FileText",
  },
  {
    id: "settings",
    label: "Setari",
    iconName: "Settings",
  },
];

export default function PageTabs() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <div className="flex flex-col text-start py-8 gap-2">
        <h2 className="text-base lg:text-4xl font-bold">
          Pagini Integrate pentru Orice Scenariu
        </h2>
        <p className="text-xl text-muted-foreground">
          Plin de dashboard-uri, aplicatii, autentificare si pagini utilitare —
          complet responsive si personalizabile din prima.
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
