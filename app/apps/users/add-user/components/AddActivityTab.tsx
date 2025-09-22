"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { UserFormData } from "../AddUserTabs";

interface AddActivityTabProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

export function AddActivityTab({}: AddActivityTabProps) {
  return (
    <div className="space-y-6">
      {/* Activity Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Activity Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Activity tracking and analytics settings will be configured
              automatically for new users. These settings can be modified after
              account creation.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">
              Default Settings
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Activity tracking enabled</li>
              <li>• Analytics collection enabled</li>
              <li>• Session duration monitoring active</li>
              <li>• Feature usage tracking enabled</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Initial Activity Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Initial Activity Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              New user accounts will start with the following initial activity
              metrics. These will be updated as the user becomes active.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-muted-foreground">Total Logins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0m</div>
              <div className="text-sm text-muted-foreground">
                Session Duration
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-muted-foreground">Features Used</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
