/**
 * TasksList Component
 * Main component for displaying tasks in both grid and table views with interactive features
 * Handles task selection, completion toggling, and provides action menus for task management
 * Supports switching between grid and table layouts with filtering and searching capabilities
 * @returns The tasks list component
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createSortableColumn, DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Task,
  getPriorityColor,
  getPriorityIcon,
  mockTasks,
} from "@/data/tasks";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Edit,
  Eye,
  Grid3X3,
  List,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/ui/sonner";

interface TasksListProps {
  onTaskSelect: (taskId: string) => void;
}

/**
 * TasksList function component
 * Renders tasks in grid or table view with interactive features
 * Manages task state and handles user interactions like selection and completion
 * @param onTaskSelect - Callback function when a task is selected
 * @returns JSX element for the tasks list
 */
export default function TasksList({ onTaskSelect }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  /**
   * Handles toggling the completion status of a task
   * Updates the task's completed state in the local state
   * @param taskId - The ID of the task to toggle
   */
  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="cursor-pointer" onClick={() => onTaskSelect(task.id)}>
            <div
              className={cn(
                "font-medium",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <Badge className={cn("text-xs", getPriorityColor(priority))}>
            {getPriorityIcon(priority)}
            <span className="ml-1 capitalize">{priority}</span>
          </Badge>
        );
      },
    },
    createSortableColumn("assignee", "Assignee"),
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string;
        return dueDate ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(dueDate).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "checklist",
      header: "Progress",
      cell: ({ row }) => {
        const checklist = row.getValue("checklist") as Task["checklist"];
        if (checklist.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        const completed = checklist.filter((item) => item.completed).length;
        return (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              {completed} / {checklist.length}
            </div>
            <div className="w-16 bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(completed / checklist.length) * 100}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        return (
          <div className="flex gap-1 flex-wrap">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(task.id);
                  showToast({
                    title: `Copied ${task.id}`,
                    description: "Customer ID copied to clipboard",
                    button: {
                      label: "Close",
                      onClick: () => console.log("Undo clicked"),
                    },
                  });
                }}
              >
                Copy Task ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTaskSelect(task.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex-1 p-6">
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  task.completed && "opacity-75"
                )}
                onClick={() => onTaskSelect(task.id)}
              >
                <CardHeader className="pb-3 w-full">
                  <div className="flex flex-col items-start justify-between w-full">
                    <div className="flex flex-col items-start gap-3 w-full">
                      <div className="flex flex-row w-full justify-between">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <Badge
                          className={cn(
                            "text-xs",
                            getPriorityColor(task.priority)
                          )}
                        >
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1 capitalize">
                            {task.priority}
                          </span>
                        </Badge>
                      </div>

                      <CardTitle
                        className={cn(
                          "text-lg w-full ",
                          task.completed &&
                            "line-through text-gray-500 dark:text-gray-50"
                        )}
                      >
                        {task.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600  dark:text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>

                  {/* Checklist Progress */}
                  {task.checklist.length > 0 && (
                    <div className="space-y-2 ">
                      <div className="flex items-center justify-between text-xs text-gray-500  dark:text-muted-foreground">
                        <span>Checklist</span>
                        <span>
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }{" "}
                          / {task.checklist.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200  dark:text-muted-foreground rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (task.checklist.filter((item) => item.completed)
                                .length /
                                task.checklist.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Task Metadata */}
                  <div className="flex flex-col items-start gap-4 justify-between text-xs text-gray-500  dark:text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {task.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-1 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {task.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{task.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-0">
          <DataTable
            columns={columns}
            data={tasks}
            searchKey="title"
            searchPlaceholder="Search tasks..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
