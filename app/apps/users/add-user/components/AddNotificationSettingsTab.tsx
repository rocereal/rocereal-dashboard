/**
 * Add Notification Settings Tab Component
 * Provides form inputs for configuring notification preferences and privacy settings during user creation
 * Allows setting default notification channels and privacy options for new accounts
 * Used within the add user tabs interface for notification and privacy configuration
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormData } from "../AddUserTabs";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

/**
 * Props for the AddNotificationSettingsTab component
 * @param formData - Complete user form data object
 * @param onFormDataChange - Callback function to update form data
 */
interface AddNotificationSettingsTabProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

/**
 * AddNotificationSettingsTab component for configuring notification and privacy settings during user creation
 * Renders checkboxes for notification channels, privacy options, and displays default configuration summary
 * Handles form state updates for notification preferences and privacy settings
 * @param formData - Complete user form data object
 * @param onFormDataChange - Callback function to update form data
 * @returns JSX element representing the notification and privacy settings form section
 */
export function AddNotificationSettingsTab({
  formData,
  onFormDataChange,
}: AddNotificationSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) =>
                  onFormDataChange({ emailNotifications: !!checked })
                }
              />
              <Label
                htmlFor="emailNotifications"
                className="flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email Notifications</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pushNotifications"
                checked={formData.pushNotifications}
                onCheckedChange={(checked) =>
                  onFormDataChange({ pushNotifications: !!checked })
                }
              />
              <Label
                htmlFor="pushNotifications"
                className="flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Push Notifications</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="smsNotifications"
                checked={formData.smsNotifications}
                onCheckedChange={(checked) =>
                  onFormDataChange({ smsNotifications: !!checked })
                }
              />
              <Label
                htmlFor="smsNotifications"
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SMS Notifications</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketingNotifications"
                checked={formData.marketingNotifications}
                onCheckedChange={(checked) =>
                  onFormDataChange({ marketingNotifications: !!checked })
                }
              />
              <Label
                htmlFor="marketingNotifications"
                className="flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Marketing Communications</span>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <Select
              value={formData.profileVisibility}
              onValueChange={(value) =>
                onFormDataChange({
                  profileVisibility: value as "public" | "private" | "team",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Team Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dataSharing"
              checked={formData.dataSharing}
              onCheckedChange={(checked) =>
                onFormDataChange({ dataSharing: !!checked })
              }
            />
            <Label htmlFor="dataSharing">Allow Data Sharing</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="analytics"
              checked={formData.analytics}
              onCheckedChange={(checked) =>
                onFormDataChange({ analytics: !!checked })
              }
            />
            <Label htmlFor="analytics">Enable Analytics</Label>
          </div>
        </CardContent>
      </Card>

      {/* Notification Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Users can customize their notification preferences after account
              creation. These default settings will be applied initially but can
              be modified in their account settings.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">
              Default Configuration
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>
                • Email notifications:{" "}
                {formData.emailNotifications ? "Enabled" : "Disabled"}
              </li>
              <li>
                • Push notifications:{" "}
                {formData.pushNotifications ? "Enabled" : "Disabled"}
              </li>
              <li>
                • SMS notifications:{" "}
                {formData.smsNotifications ? "Enabled" : "Disabled"}
              </li>
              <li>
                • Marketing emails:{" "}
                {formData.marketingNotifications ? "Enabled" : "Disabled"}
              </li>
              <li>• Profile visibility: {formData.profileVisibility}</li>
              <li>
                • Data sharing: {formData.dataSharing ? "Enabled" : "Disabled"}
              </li>
              <li>
                • Analytics: {formData.analytics ? "Enabled" : "Disabled"}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
