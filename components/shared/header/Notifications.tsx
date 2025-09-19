"use client";

import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { sampleNotifications, type Notification } from "@/data/notifications";
import { useState } from "react";

export function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-card dark:bg-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                  )
                }
              >
                Mark all read
              </Button>
            )}
          </div>
          <Separator />
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    !notification.read
                      ? "bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
                      : "bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
                  }`}
                >
                  <div
                    className={`mt-0.5 ${
                      notification.type === "success"
                        ? "text-green-500"
                        : notification.type === "warning"
                        ? "text-yellow-500"
                        : notification.type === "error"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    <notification.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
