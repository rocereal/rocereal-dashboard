/**
 * User Details Tabs Component
 * Provides tabbed interface for displaying different aspects of user information
 * Includes tabs for personal info, security settings, activity, plans, and notifications
 * Organizes user details into logical sections for better navigation
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/data/users-data";
import { PersonalInformationTab } from "./PersonalInformationTab";
import { SecurityTab } from "./SecurityTab";
import { ActivityTab } from "./ActivityTab";
import { PlansTab } from "./PlansTab";
import { NotificationSettingsTab } from "./NotificationSettingsTab";
import {
  User as UserIcon,
  Shield,
  Activity,
  CreditCard,
  Bell,
} from "lucide-react";

/**
 * Props for the UserDetailsTabs component
 * @param user - User object containing all user information
 * @param formatDate - Function to format dates for display
 * @param formatDateTime - Function to format date and time for display
 */
interface UserDetailsTabsProps {
  user: User;
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
}

/**
 * UserDetailsTabs component for organizing user information into tabs
 * Renders a tabbed interface with personal, security, activity, plans, and notifications sections
 * Each tab contains specific user information and settings
 * @param user - User object containing all user information
 * @param formatDate - Function to format dates for display
 * @param formatDateTime - Function to format date and time for display
 * @returns JSX element representing the tabbed user details interface
 */
export function UserDetailsTabs({
  user,
  formatDate,
  formatDateTime,
}: UserDetailsTabsProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Personal</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Activity</span>
        </TabsTrigger>
        <TabsTrigger value="plans" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">Plans</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        <PersonalInformationTab user={user} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecurityTab user={user} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <ActivityTab
          user={user}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />
      </TabsContent>

      <TabsContent value="plans" className="mt-6">
        <PlansTab user={user} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationSettingsTab user={user} formatDate={formatDate} />
      </TabsContent>
    </Tabs>
  );
}
