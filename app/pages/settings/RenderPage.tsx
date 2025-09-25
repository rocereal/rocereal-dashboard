/**
 * Settings Render Page Component
 * Main render component for the settings page displaying organized tabbed interface
 * Provides dashboard header with breadcrumbs and tabbed navigation for different settings sections
 * Includes Profile, Security, Notifications, and Privacy tabs with respective components
 * Part of the user account management system for Fisio platform settings
 */

"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { settingsTabs } from "@/data/settings";
import { Profile } from "./(components)/Profile";
import { Security } from "./(components)/Security";
import { Notifications } from "./(components)/Notifications";
import { Privacy } from "./(components)/Privacy";
import { DashboardHeader } from "@/components/headers/dashboard-header";

/**
 * RenderPage component for displaying the complete settings interface
 * Renders dashboard header, page title, and tabbed navigation with all settings sections
 * Organizes settings into logical tabs for better user experience
 * @returns JSX element representing the full settings page with tabs
 */
export default function RenderPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]}
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account details on Fisio."
      />

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
