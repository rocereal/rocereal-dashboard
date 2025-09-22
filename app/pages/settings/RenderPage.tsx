"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { settingsTabs } from "@/data/settings";
import { Profile } from "./(components)/Profile";
import { Security } from "./(components)/Security";
import { Notifications } from "./(components)/Notifications";
import { Privacy } from "./(components)/Privacy";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";

export default function RenderPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]}
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account details on Fisio."
      />
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <TabsWithIcons tabs={settingsTabs}>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="security">
          <Security />
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications />
        </TabsContent>
        <TabsContent value="privacy">
          <Privacy />
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}
