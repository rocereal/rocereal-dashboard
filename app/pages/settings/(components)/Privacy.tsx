/**
 * Privacy Settings Component
 * User privacy preferences management interface for data sharing and privacy controls
 * Provides toggle switches for analytics, personalized content, profile visibility, and activity status
 * Includes data export and account deletion options for GDPR compliance
 * Part of the settings section for user privacy and data management
 * @returns JSX element representing the privacy settings interface
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
import { Button } from "@/components/ui/button";

/**
 * Privacy component for managing user privacy and data preferences
 * Renders toggle switches for data sharing and privacy settings
 * Provides interface for data export and account deletion
 * @returns JSX element representing the privacy settings form
 */
export function Privacy() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Sharing</CardTitle>
          <CardDescription>
            Control how your data is shared and used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Allow us to collect analytics data to improve our services.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Personalized content</Label>
              <p className="text-sm text-muted-foreground">
                Receive personalized recommendations and content.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Manage your privacy preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile visibility</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to other users.
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activity status</Label>
              <p className="text-sm text-muted-foreground">
                Show when you&apos;re online and active.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Download or delete your personal data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Export Data</Button>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
