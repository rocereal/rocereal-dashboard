"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/data/users-data";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

interface SecurityTabProps {
  user: User;
  formatDate: (dateString: string) => string;
}

export function SecurityTab({ user, formatDate }: SecurityTabProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user.metadata.twoFactorEnabled
  );

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Update Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium">Enable 2FA</span>
                <Badge
                  variant={twoFactorEnabled ? "default" : "outline"}
                  className={
                    twoFactorEnabled
                      ? "bg-green-100 text-green-800"
                      : "text-muted-foreground"
                  }
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="authMethod">Authentication Method</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="sms"
                      name="authMethod"
                      defaultChecked
                    />
                    <Label
                      htmlFor="sms"
                      className="flex items-center space-x-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>SMS</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="app" name="authMethod" />
                    <Label
                      htmlFor="app"
                      className="flex items-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Authenticator App</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  defaultValue={user.metadata.phone || ""}
                />
              </div>

              <div className="flex justify-end">
                <Button>Setup 2FA</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label>Security Questions</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {user.metadata.securityQuestions ? "Set" : "Not configured"}
                </span>
                <Badge
                  variant={
                    user.metadata.securityQuestions ? "default" : "outline"
                  }
                  className={
                    user.metadata.securityQuestions
                      ? "bg-green-100 text-green-800"
                      : "text-muted-foreground"
                  }
                >
                  {user.metadata.securityQuestions ? "Set" : "Not Set"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Password Change</Label>
              <div className="text-sm text-muted-foreground">
                {formatDate(user.metadata.lastPasswordChange)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Login Attempts</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Failed attempts in last 24h
                </span>
                <Badge variant="outline">{user.metadata.loginAttempts}</Badge>
              </div>
            </div>

            <div className="space-y-2 items-center justify-center">
              <Label>Account Status</Label>
              <Badge
                className={
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : user.status === "inactive"
                    ? "bg-gray-100 text-gray-800"
                    : user.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline">Reset Security Questions</Button>
            <Button variant="outline">View Login History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
