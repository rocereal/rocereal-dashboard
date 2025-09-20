"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckSquare,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Search,
  SortAsc,
} from "lucide-react";

interface TasksHeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function TasksHeader({
  sidebarOpen,
  onSidebarToggle,
}: TasksHeaderProps) {
  return (
    <div className="border-b  px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={onSidebarToggle}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Header Content */}
          <div>
            <h1 className="text-xl font-semibold">All Tasks</h1>
            <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">
              Manage your tasks and stay organized
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 data-[state=on]:bg-white"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 data-[state=on]:bg-white"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
      </div>

      {/* Task Statistics Bar */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600 dark:text-muted-foreground">
            <span className="font-medium text-green-600">8</span> of{" "}
            <span className="font-medium">24</span> tasks completed
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>8
            Completed
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
            12 Pending
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>4
            Overdue
          </Badge>
        </div>
      </div>
    </div>
  );
}
