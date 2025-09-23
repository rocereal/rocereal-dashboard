"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

/**
 * Activity item structure for file activity tracking
 * @param action - The action performed (e.g., "viewed", "edited", "shared")
 * @param user - The name of the user who performed the action
 * @param time - The timestamp when the action occurred
 * @param avatar - The avatar URL of the user
 */
interface ActivityItem {
  action: string;
  user: string;
  time: string;
  avatar: string;
}

/**
 * Props for ActivityTab component
 * @param activities - Array of activity items to display
 */
interface ActivityTabProps {
  activities: ActivityItem[];
}

/**
 * Activity Tab Component
 * Displays recent file activity in a chronological list format
 * Shows user avatars, actions performed, and timestamps for each activity
 * Provides a timeline view of file interactions and modifications
 * Uses avatar fallbacks and formatted timestamps for better readability
 * @param activities - Array of activity items to display
 * @returns The JSX element representing the file activity timeline
 */
export default function ActivityTab({ activities }: ActivityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">this file</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
