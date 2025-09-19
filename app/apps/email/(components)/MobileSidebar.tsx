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

interface MobileSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  mobileSidebarOpen: boolean;
  onMobileSidebarChange: (open: boolean) => void;
}

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
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
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
