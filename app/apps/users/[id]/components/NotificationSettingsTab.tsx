/**
 * Notification Settings Tab Component
 * Allows users to configure their notification preferences across different channels
 * Provides granular control over email, push, SMS, and in-app notifications
 * Organized by categories with overview statistics and scheduling options
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/data/users-data";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";

/**
 * Props for the NotificationSettingsTab component
 * @param user - User object containing all user information
 * @param formatDate - Function to format dates for display
 */
interface NotificationSettingsTabProps {
  user: User;
  formatDate: (dateString: string) => string;
}

/**
 * Interface for individual notification setting configuration
 */
interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  category: "account" | "marketing" | "security" | "social";
}

export function NotificationSettingsTab({
  user,
}: NotificationSettingsTabProps) {
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: "account-updates",
      label: "Account Updates",
      description: "Important updates about your account status and changes",
      email: user.metadata.notifications.email,
      push: user.metadata.notifications.push,
      sms: false,
      inApp: true,
      category: "account",
    },
    {
      id: "security-alerts",
      label: "Security Alerts",
      description: "Login attempts, password changes, and security events",
      email: true,
      push: true,
      sms: user.metadata.notifications.sms,
      inApp: true,
      category: "security",
    },
    {
      id: "feature-updates",
      label: "Feature Updates",
      description: "New features, improvements, and platform announcements",
      email: user.metadata.notifications.email,
      push: false,
      sms: false,
      inApp: true,
      category: "account",
    },
    {
      id: "marketing-emails",
      label: "Marketing & Promotions",
      description: "Product updates, tips, and promotional content",
      email: user.metadata.notifications.marketing,
      push: false,
      sms: false,
      inApp: false,
      category: "marketing",
    },
    {
      id: "team-invites",
      label: "Team Invitations",
      description: "When you're invited to join teams or projects",
      email: user.metadata.notifications.email,
      push: user.metadata.notifications.push,
      sms: false,
      inApp: true,
      category: "social",
    },
    {
      id: "comment-replies",
      label: "Comment Replies",
      description: "When someone replies to your comments or mentions you",
      email: false,
      push: user.metadata.notifications.push,
      sms: false,
      inApp: true,
      category: "social",
    },
  ]);

  /**
   * Updates a specific notification setting for a given notification type
   * @param id - The ID of the notification setting to update
   * @param type - The notification channel type (email, push, sms, inApp)
   * @param value - The new boolean value for the setting
   */
  const updateNotificationSetting = (
    id: string,
    type: "email" | "push" | "sms" | "inApp",
    value: boolean
  ) => {
    setNotificationSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, [type]: value } : setting
      )
    );
  };

  /**
   * Returns the appropriate icon component for a notification category
   * @param category - The notification category (account, security, marketing, social)
   * @returns JSX element representing the category icon
   */
  const getCategoryIcon = (category: NotificationSetting["category"]) => {
    switch (category) {
      case "account":
        return <Bell className="w-4 h-4 text-blue-600" />;
      case "security":
        return <Smartphone className="w-4 h-4 text-red-600" />;
      case "marketing":
        return <Mail className="w-4 h-4 text-purple-600" />;
      case "social":
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  /**
   * Returns the appropriate color classes for a notification category badge
   * @param category - The notification category (account, security, marketing, social)
   * @returns CSS class string for the category badge styling
   */
  const getCategoryColor = (category: NotificationSetting["category"]) => {
    switch (category) {
      case "account":
        return "bg-blue-100 text-blue-800";
      case "security":
        return "bg-red-100 text-red-800";
      case "marketing":
        return "bg-purple-100 text-purple-800";
      case "social":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = ["account", "security", "social", "marketing"] as const;

  /**
   * NotificationSettingsTab component for managing user notification preferences
   * Renders overview statistics, categorized notification settings with toggles, and scheduling options
   * Allows users to control email, push, SMS, and in-app notifications for different categories
   * @param user - User object containing all user information
   * @returns JSX element representing the notification settings interface
   */
  return (
    <div className="space-y-6">
      {/* Notification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notificationSettings.filter((s) => s.email).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Email Notifications
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {notificationSettings.filter((s) => s.push).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Push Notifications
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notificationSettings.filter((s) => s.sms).length}
              </div>
              <div className="text-sm text-muted-foreground">
                SMS Notifications
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {notificationSettings.filter((s) => s.inApp).length}
              </div>
              <div className="text-sm text-muted-foreground">
                In-App Notifications
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings by Category */}
      {categories.map((category) => {
        const categorySettings = notificationSettings.filter(
          (setting) => setting.category === category
        );

        if (categorySettings.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex flex-wrap gap-4 items-center space-x-2">
                {getCategoryIcon(category)}
                <span className="capitalize">{category} Notifications</span>
                <Badge className={getCategoryColor(category)}>
                  {categorySettings.length} settings
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{setting.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor={`${setting.id}-email`}
                        className="text-sm"
                      >
                        Email
                      </Label>
                      <Switch
                        id={`${setting.id}-email`}
                        checked={setting.email}
                        onCheckedChange={(checked) =>
                          updateNotificationSetting(
                            setting.id,
                            "email",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor={`${setting.id}-push`} className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id={`${setting.id}-push`}
                        checked={setting.push}
                        onCheckedChange={(checked) =>
                          updateNotificationSetting(setting.id, "push", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor={`${setting.id}-sms`} className="text-sm">
                        SMS
                      </Label>
                      <Switch
                        id={`${setting.id}-sms`}
                        checked={setting.sms}
                        onCheckedChange={(checked) =>
                          updateNotificationSetting(setting.id, "sms", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor={`${setting.id}-inapp`}
                        className="text-sm"
                      >
                        In-App
                      </Label>
                      <Switch
                        id={`${setting.id}-inapp`}
                        checked={setting.inApp}
                        onCheckedChange={(checked) =>
                          updateNotificationSetting(
                            setting.id,
                            "inApp",
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Quiet Hours</Label>
            <p className="text-sm text-muted-foreground">
              Configure when you don&apos;t want to receive notifications
            </p>
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <Label htmlFor="quiet-start" className="text-xs">
                  Start Time
                </Label>
                <input
                  id="quiet-start"
                  type="time"
                  defaultValue="22:00"
                  className="px-3 py-1 border rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quiet-end" className="text-xs">
                  End Time
                </Label>
                <input
                  id="quiet-end"
                  type="time"
                  defaultValue="08:00"
                  className="px-3 py-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weekend Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications on weekends
            </p>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button>Save Notification Settings</Button>
      </div>
    </div>
  );
}
