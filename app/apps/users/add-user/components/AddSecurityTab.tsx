"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserFormData } from "../AddUserTabs";
import { Shield, ShieldCheck } from "lucide-react";

interface AddSecurityTabProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

export function AddSecurityTab({
  formData,
  onFormDataChange,
}: AddSecurityTabProps) {
  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="twoFactorEnabled"
              checked={formData.twoFactorEnabled}
              onCheckedChange={(checked) =>
                onFormDataChange({ twoFactorEnabled: !!checked })
              }
            />
            <Label
              htmlFor="twoFactorEnabled"
              className="flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <div>
                <span className="font-medium">
                  Enable Two-Factor Authentication
                </span>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to the account
                </p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="securityQuestions"
              checked={formData.securityQuestions}
              onCheckedChange={(checked) =>
                onFormDataChange({ securityQuestions: !!checked })
              }
            />
            <Label
              htmlFor="securityQuestions"
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <div>
                <span className="font-medium">Set up Security Questions</span>
                <p className="text-sm text-muted-foreground">
                  Provide backup recovery options
                </p>
              </div>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              The user will be prompted to set up a password and configure their
              security settings after account creation. They will also receive
              an email with account setup instructions.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Post-Creation Setup
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Password creation and confirmation</li>
              <li>• Two-factor authentication setup (if enabled)</li>
              <li>• Security questions configuration (if enabled)</li>
              <li>• Account verification email</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
