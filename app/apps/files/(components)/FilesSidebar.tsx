"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Archive,
  Clock,
  FileText,
  HardDrive,
  Home,
  Image,
  Menu,
  Music,
  Settings,
  Share,
  Star,
  Upload,
  Video,
} from "lucide-react";

interface FilesSidebarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  currentPath: string;
  onPathChange: (path: string) => void;
}

// Mock storage data
const storageData = {
  used: 2.4,
  total: 15,
  unit: "GB",
};

const quickAccessItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    count: 24,
  },
  {
    id: "recent",
    label: "Recent",
    icon: Clock,
    path: "/recent",
    count: 8,
  },
  {
    id: "starred",
    label: "Starred",
    icon: Star,
    path: "/starred",
    count: 3,
  },
  {
    id: "shared",
    label: "Shared",
    icon: Share,
    path: "/shared",
    count: 12,
  },
];

const fileTypeStats = [
  { type: "Images", icon: Image, count: 45, color: "text-blue-600" },
  { type: "Videos", icon: Video, count: 12, color: "text-red-600" },
  { type: "Documents", icon: FileText, count: 28, color: "text-green-600" },
  { type: "Archives", icon: Archive, count: 8, color: "text-orange-600" },
  { type: "Music", icon: Music, count: 15, color: "text-purple-600" },
];

export default function FilesSidebar({
  sidebarOpen,
  onSidebarToggle,
  currentPath,
  onPathChange,
}: FilesSidebarProps) {
  const storagePercentage = (storageData.used / storageData.total) * 100;

  return (
    <div className="hidden lg:block">
      <div
        className={cn(
          "border-r transition-all duration-300 bg-white",
          sidebarOpen ? "w-80" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            {sidebarOpen && (
              <Button size="sm" className="bg-primary">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
          </div>
        </div>

        {/* Storage Overview */}
        {sidebarOpen && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Storage</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {storageData.used} {storageData.unit} used
                </span>
                <span className="text-gray-600">
                  {storageData.total} {storageData.unit} total
                </span>
              </div>

              <Progress value={storagePercentage} className="h-2" />

              <div className="text-xs text-gray-500">
                {storageData.total - storageData.used} {storageData.unit} free
              </div>
            </div>
          </div>
        )}

        {/* Quick Access */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {sidebarOpen ? "Quick Access" : ""}
            </h3>
            <div className="space-y-1">
              {quickAccessItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPathChange(item.path)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-lg",
                    currentPath === item.path &&
                      "bg-primary/5 border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        currentPath === item.path
                          ? "text-primary"
                          : "text-gray-500"
                      )}
                    />
                    {sidebarOpen && (
                      <div className="flex-1 flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm",
                            currentPath === item.path
                              ? "font-medium text-primary"
                              : "text-gray-700"
                          )}
                        >
                          {item.label}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Types */}
          {sidebarOpen && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                File Types
              </h3>
              <div className="space-y-3">
                {fileTypeStats.map((stat) => (
                  <div key={stat.type} className="flex items-center gap-3">
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">{stat.type}</div>
                      <div className="text-xs text-gray-500">
                        {stat.count} files
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Settings */}
        {sidebarOpen && (
          <div className="p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
