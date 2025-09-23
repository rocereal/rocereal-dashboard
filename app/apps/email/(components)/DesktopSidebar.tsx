"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sidebarItems } from "@/data/email";
import { cn } from "@/lib/utils";
import { Menu, Plus } from "lucide-react";

/**
 * Props for DesktopSidebar component
 * @param selectedCategory - The currently selected email category
 * @param onCategoryChange - Callback function when category selection changes
 * @param sidebarOpen - Whether the sidebar is expanded or collapsed
 * @param onSidebarToggle - Callback function to toggle sidebar visibility
 */
interface DesktopSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

/**
 * Desktop Sidebar Component
 * Navigation sidebar for email application on desktop devices
 * Displays email categories with icons, labels, and unread counts
 * Supports collapsible/expandable state with smooth transitions
 * Includes compose button and category selection functionality
 * @param selectedCategory - The currently selected email category
 * @param onCategoryChange - Callback function when category selection changes
 * @param sidebarOpen - Whether the sidebar is expanded or collapsed
 * @param onSidebarToggle - Callback function to toggle sidebar visibility
 * @returns The JSX element representing the desktop email sidebar
 */
export default function DesktopSidebar({
  selectedCategory,
  onCategoryChange,
  sidebarOpen,
  onSidebarToggle,
}: DesktopSidebarProps) {
  return (
    <div className="hidden lg:block">
      <div
        className={cn(
          "border-r transition-all duration-300 h-full",
          sidebarOpen ? "w-64" : "w-16"
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
              <Button size="sm" className="ml-2">
                <Plus className="h-4 w-4 mr-2" />
                Compose
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-secondary cursor-pointer transition-colors",
                  selectedCategory === item.id && "bg-primary/10 text-primary"
                )}
              >
                <Icon className={cn("h-5 w-5", item.color)} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
