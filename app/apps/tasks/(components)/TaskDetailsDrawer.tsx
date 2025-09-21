"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  Edit,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Task, mockTasks } from "@/data/tasks";

interface TaskDetailsDrawerProps {
  taskId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailsDrawer({
  taskId,
  isOpen,
  onOpenChange,
}: TaskDetailsDrawerProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId && isOpen) {
      setLoading(true);
      // Simulate API call
      const foundTask = mockTasks.find((t) => t.id === taskId);
      setTask(foundTask || null);
      setLoading(false);
    }
  }, [taskId, isOpen]);

  const handleTaskToggle = () => {
    if (!task) return;
    setTask({ ...task, completed: !task.completed });
  };

  const handleChecklistToggle = (checklistId: string) => {
    if (!task) return;
    setTask({
      ...task,
      checklist: task.checklist.map((item) =>
        item.id === checklistId ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      case "low":
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  if (!taskId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[700px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Task Details</SheetTitle>
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading task...</p>
            </div>
          </div>
        ) : !task ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Task not found</h3>
              <p className="text-gray-600">
                The task you're looking for doesn't exist.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Task Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={handleTaskToggle}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h2
                      className={cn(
                        "text-2xl font-bold",
                        task.completed && "line-through text-gray-500"
                      )}
                    >
                      {task.title}
                    </h2>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "text-sm px-3 py-1 ml-4",
                    getPriorityColor(task.priority)
                  )}
                >
                  {getPriorityIcon(task.priority)}
                  <span className="ml-2 capitalize">{task.priority}</span>
                </Badge>
              </div>
            </div>

            {/* Task Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Checklist */}
                {task.checklist.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        Checklist
                        <Badge variant="outline" className="ml-auto">
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }{" "}
                          / {task.checklist.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all"
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

                        {/* Checklist Items */}
                        <div className="space-y-3">
                          {task.checklist.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                            >
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={() =>
                                  handleChecklistToggle(item.id)
                                }
                              />
                              <span
                                className={cn(
                                  "text-sm flex-1",
                                  item.completed && "line-through text-gray-500"
                                )}
                              >
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Task Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Assignee
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{task.assignee}</span>
                      </div>
                    </div>

                    {task.dueDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Due Date
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Created
                      </Label>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Status
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={task.completed ? "default" : "secondary"}
                        >
                          {task.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                {task.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t p-6">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
