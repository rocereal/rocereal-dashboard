/**
 * Notifications Settings Component
 * User notification preferences management interface for email and push notifications
 * Provides toggle switches for marketing emails, security alerts, account updates, and push notifications
 * Allows users to customize their notification preferences and communication settings
 * Part of the settings section for user account management and preferences
 * @returns JSX element representing the notifications settings interface
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Notifications component for managing user notification preferences
 * Renders toggle switches for email and push notification settings
 * Provides interface for customizing communication preferences
 * @returns JSX element representing the notifications settings form
 */
export function Notifications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what email notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and updates.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about security-related activities.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Account updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about account changes.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Manage push notifications on your devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices.
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound alerts</Label>
              <p className="text-sm text-muted-foreground">
                Play sound when receiving notifications.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
