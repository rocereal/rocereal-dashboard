"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Filter,
  Home,
  ListTodo,
  Menu,
  Plus,
  Search,
  Star,
} from "lucide-react";

interface TasksSidebarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onCreateTask: () => void;
}

// Mock task statistics
const taskStats = {
  total: 24,
  completed: 8,
  pending: 12,
  overdue: 4,
};

export default function TasksSidebar({
  sidebarOpen,
  onSidebarToggle,
  onCreateTask,
}: TasksSidebarProps) {
  const menuItems = [
    {
      id: "all",
      label: "All Tasks",
      icon: Home,
      count: taskStats.total,
      active: true,
    },
    {
      id: "today",
      label: "Today",
      icon: Calendar,
      count: 6,
      active: false,
    },
    {
      id: "important",
      label: "Important",
      icon: Star,
      count: 3,
      active: false,
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: taskStats.pending,
      active: false,
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle2,
      count: taskStats.completed,
      active: false,
    },
    {
      id: "overdue",
      label: "Overdue",
      icon: AlertCircle,
      count: taskStats.overdue,
      active: false,
    },
  ];

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
              <Button size="sm" onClick={onCreateTask} className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* Task Statistics */}
        {sidebarOpen && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {taskStats.completed}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Completed</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    {taskStats.pending}
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-1">Pending</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {taskStats.total}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">Total</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    {taskStats.overdue}
                  </span>
                </div>
                <p className="text-xs text-red-600 mt-1">Overdue</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100",
                item.active && "bg-primary/5 border-l-4 border-l-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    item.active ? "text-primary" : "text-gray-500"
                  )}
                />
                {sidebarOpen && (
                  <div className="flex-1 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm",
                        item.active
                          ? "font-medium text-primary"
                          : "text-gray-700"
                      )}
                    >
                      {item.label}
                    </span>
                    <Badge
                      variant={item.active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.count}
                    </Badge>
                  </div>
                )}
              </div>
            </button>
          ))}
        </nav>

        {/* Filters */}
        {sidebarOpen && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Due Date
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Star className="h-4 w-4 mr-2" />
                Priority
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Status
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
