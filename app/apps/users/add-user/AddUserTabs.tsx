/**
 * Add User Tabs Component
 * Provides tabbed interface for creating new user accounts with comprehensive form sections
 * Organizes user creation into logical tabs: personal info, security, activity, plans, and notifications
 * Manages form data state across all tabs and coordinates data updates
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Bell,
  CreditCard,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { AddActivityTab } from "./components/AddActivityTab";
import { AddNotificationSettingsTab } from "./components/AddNotificationSettingsTab";
import { AddPersonalInformationTab } from "./components/AddPersonalInformationTab";
import { AddPlansTab } from "./components/AddPlansTab";
import { AddSecurityTab } from "./components/AddSecurityTab";

/**
 * Interface for user form data used in the add user workflow
 * Contains all fields required to create a new user account
 * Organized into logical sections for form management
 */
export interface UserFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";

  // Account Settings
  role: "admin" | "manager" | "user" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  plan: "free" | "starter" | "professional" | "enterprise";

  // Professional Information
  jobTitle: string;
  department: string;
  company: string;
  industry: string;
  experience: string;

  // Preferences & Settings
  timezone: string;
  language: string;
  theme: "light" | "dark" | "system";

  // Security Settings
  twoFactorEnabled: boolean;
  securityQuestions: boolean;

  // Notification Preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingNotifications: boolean;
  profileVisibility: "public" | "private" | "team";
  dataSharing: boolean;
  analytics: boolean;

  // Emergency Contacts
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;

  // Addresses
  addresses: Array<{
    id: string;
    type: "home" | "work" | "other";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isPrimary: boolean;
  }>;
}

/**
 * Props for the AddUserTabs component
 * @param formData - Complete user form data object
 * @param onFormDataChange - Callback function to update form data
 */
interface AddUserTabsProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

/**
 * AddUserTabs component for organizing user creation form into tabbed sections
 * Renders tab navigation and content areas for personal, security, activity, plans, and notifications
 * Coordinates form data updates across all tab components
 * @param formData - Complete user form data object
 * @param onFormDataChange - Callback function to update form data
 * @returns JSX element representing the tabbed user creation interface
 */
export function AddUserTabs({ formData, onFormDataChange }: AddUserTabsProps) {
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
        <AddPersonalInformationTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <AddSecurityTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <AddActivityTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>

      <TabsContent value="plans" className="mt-6">
        <AddPlansTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <AddNotificationSettingsTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>
    </Tabs>
  );
}
