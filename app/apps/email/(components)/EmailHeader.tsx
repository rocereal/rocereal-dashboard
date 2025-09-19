"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Search } from "lucide-react";
import MobileSidebar from "./MobileSidebar";

interface EmailHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  mobileSidebarOpen: boolean;
  onMobileSidebarChange: (open: boolean) => void;
}

export default function EmailHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  mobileSidebarOpen,
  onMobileSidebarChange,
}: EmailHeaderProps) {
  return (
    <div className="border-b px-0 lg:px-4 py-4">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <MobileSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          mobileSidebarOpen={mobileSidebarOpen}
          onMobileSidebarChange={onMobileSidebarChange}
        />

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
