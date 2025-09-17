"use client";

import * as React from "react";
import {
  Bell,
  Search,
  Maximize,
  Minimize,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Check,
  X,
  Menu,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme-provider";
import { useSidebar } from "@/components/ui/sidebar";
import { sampleNotifications, type Notification } from "@/data/notifications";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [notifications, setNotifications] =
    React.useState<Notification[]>(sampleNotifications);

  // Multi-select options (placeholder data)
  const multiSelectOptions = [
    { id: "option1", label: "Dashboard" },
    { id: "option2", label: "Analytics" },
    { id: "option3", label: "Reports" },
    { id: "option4", label: "Settings" },
    { id: "option5", label: "Users" },
  ];

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle multi-select
  const handleMultiSelectChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, optionId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== optionId));
    }
  };

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

  // Theme toggle handler
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  return (
    <header
      className={`flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 ${className}`}
    >
      {/* Sidebar Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8"
      >
        {state === "expanded" ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleThemeChange("light")}
              className={theme === "light" ? "bg-accent" : ""}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange("dark")}
              className={theme === "dark" ? "bg-accent" : ""}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange("system")}
              className={theme === "system" ? "bg-accent" : ""}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
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
          <PopoverContent align="end" className="w-80">
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
                        !notification.read ? "bg-accent/50" : ""
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

        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="h-9 w-9"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          </span>
        </Button>

        {/* Avatar Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
