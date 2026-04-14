"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Bell, Shield, User as UserIcon } from "lucide-react";
import { AddActivityTab } from "./components/AddActivityTab";
import { AddNotificationSettingsTab } from "./components/AddNotificationSettingsTab";
import { AddPersonalInformationTab } from "./components/AddPersonalInformationTab";
import { AddSecurityTab } from "./components/AddSecurityTab";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  role: "admin" | "manager" | "user" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  plan: "free" | "starter" | "professional" | "enterprise";
  jobTitle: string;
  department: string;
  company: string;
  industry: string;
  experience: string;
  timezone: string;
  language: string;
  theme: "light" | "dark" | "system";
  twoFactorEnabled: boolean;
  securityQuestions: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingNotifications: boolean;
  profileVisibility: "public" | "private" | "team";
  dataSharing: boolean;
  analytics: boolean;
  emergencyContacts: Array<{ id: string; name: string; relationship: string; phone: string; email: string }>;
  addresses: Array<{ id: string; type: "home" | "work" | "other"; street: string; city: string; state: string; zipCode: string; country: string; isPrimary: boolean }>;
}

interface AddUserTabsProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

export function AddUserTabs({ formData, onFormDataChange }: AddUserTabsProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
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
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        <AddPersonalInformationTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>
      <TabsContent value="security" className="mt-6">
        <AddSecurityTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>
      <TabsContent value="activity" className="mt-6">
        <AddActivityTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>
      <TabsContent value="notifications" className="mt-6">
        <AddNotificationSettingsTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>
    </Tabs>
  );
}
