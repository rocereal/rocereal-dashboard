"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { settingsTabs } from "@/data/settings";
import { Profile } from "./(components)/Profile";
import { Security } from "./(components)/Security";
import { Notifications } from "./(components)/Notifications";
import { Privacy } from "./(components)/Privacy";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <TabsWithIcons tabs={settingsTabs}>
        <TabsContent value="profile" className="mt-6">
          <Profile />
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <Security />
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <Notifications />
        </TabsContent>
        <TabsContent value="privacy" className="mt-6">
          <Privacy />
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}
