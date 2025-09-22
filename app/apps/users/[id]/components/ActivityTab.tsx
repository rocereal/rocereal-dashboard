"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { activities, ActivityItem, User } from "@/data/users-data";
import {
  Activity,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

interface ActivityTabProps {
  user: User;
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
}

export function ActivityTab({
  user,
  formatDate,
  formatDateTime,
}: ActivityTabProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4 text-green-600" />;
      case "logout":
        return <LogOut className="w-4 h-4 text-red-600" />;
      case "feature_used":
        return <Activity className="w-4 h-4 text-blue-600" />;
      case "profile_updated":
        return <Monitor className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device?: string) => {
    if (!device) return null;

    if (device.includes("iPhone") || device.includes("Android")) {
      return <Smartphone className="w-4 h-4 text-gray-500" />;
    } else if (device.includes("iPad") || device.includes("Tablet")) {
      return <Tablet className="w-4 h-4 text-gray-500" />;
    } else {
      return <Monitor className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {user.metadata.totalLogins}
                </p>
                <p className="text-sm text-muted-foreground">Total Logins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {user.metadata.sessionDuration}m
                </p>
                <p className="text-sm text-muted-foreground">Avg Session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {user.metadata.featuresUsed.length}
                </p>
                <p className="text-sm text-muted-foreground">Features Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{formatDateTime(activity.timestamp)}</span>
                    {activity.device && (
                      <div className="flex items-center space-x-1">
                        {getDeviceIcon(activity.device)}
                        <span>{activity.device}</span>
                      </div>
                    )}
                    {activity.location && <span>📍 {activity.location}</span>}
                  </div>
                  {activity.ipAddress && (
                    <div className="text-xs text-muted-foreground">
                      IP: {activity.ipAddress}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <span>Feature Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.metadata.featuresUsed.map((feature, index) => (
              <div key={feature} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {feature.replace("-", " ")}
                  </span>
                  <Badge variant="outline">
                    {Math.floor(Math.random() * 50) + 10}% used
                  </Badge>
                </div>
                <Progress
                  value={Math.floor(Math.random() * 50) + 10}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LogIn className="w-5 h-5" />
            <span>Login History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center space-x-3">
                <LogIn className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Successful login</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(user.lastLogin || "2025-01-20T14:30:00Z")}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Success</Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center space-x-3">
                <LogIn className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Failed login attempt</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime("2025-01-19T08:15:00Z")}
                  </p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Failed</Badge>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <LogIn className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Successful login</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime("2025-01-18T09:45:00Z")}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Success</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
