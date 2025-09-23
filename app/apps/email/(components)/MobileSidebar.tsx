"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarItems } from "@/data/email";
import { cn } from "@/lib/utils";
import { Menu, Plus, X } from "lucide-react";

/**
 * Props for MobileSidebar component
 * @param selectedCategory - The currently selected email category
 * @param onCategoryChange - Callback function when category selection changes
 * @param mobileSidebarOpen - Whether the mobile sidebar sheet is open
 * @param onMobileSidebarChange - Callback function to control sidebar open/close state
 */
interface MobileSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  mobileSidebarOpen: boolean;
  onMobileSidebarChange: (open: boolean) => void;
}

/**
 * Mobile Sidebar Component
 * Navigation sidebar for email application on mobile devices
 * Uses Sheet component for slide-out drawer behavior on small screens
 * Displays email categories with icons, labels, and unread counts
 * Includes compose button and close menu functionality
 * Responsive design that only shows on mobile/tablet devices
 * @param selectedCategory - The currently selected email category
 * @param onCategoryChange - Callback function when category selection changes
 * @param mobileSidebarOpen - Whether the mobile sidebar sheet is open
 * @param onMobileSidebarChange - Callback function to control sidebar open/close state
 * @returns The JSX element representing the mobile email sidebar sheet
 */
export default function MobileSidebar({
  selectedCategory,
  onCategoryChange,
  mobileSidebarOpen,
  onMobileSidebarChange,
}: MobileSidebarProps) {
  return (
    <div className="lg:hidden">
      <Sheet open={mobileSidebarOpen} onOpenChange={onMobileSidebarChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {/* Mobile Sidebar */}
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose
                </Button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 p-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onCategoryChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors",
                      selectedCategory === item.id &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", item.color)} />
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Close Button */}
            <div className="p-4 border-t">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Close Menu
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
