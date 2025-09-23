/**
 * Task Details Render Page Component
 * Displays detailed view of a specific task with full information, checklist, and actions
 * Handles task state management, checklist toggling, and navigation
 * Used for individual task detail pages accessed via dynamic routing
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Task, mockTasks } from "@/data/tasks";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Edit,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * TaskDetailsPage component for displaying individual task details
 * Fetches and displays task information, handles checklist interactions, and provides navigation
 * @returns JSX element representing the full task details page
 */
export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const foundTask = mockTasks.find((t) => t.id === taskId);
    setTask(foundTask || null);
    setLoading(false);
  }, [taskId]);

  /**
   * Toggles the completion status of the current task
   * Updates the task state to mark it as completed or incomplete
   */
  const handleTaskToggle = () => {
    if (!task) return;
    setTask({ ...task, completed: !task.completed });
  };

  /**
   * Toggles the completion status of a specific checklist item
   * @param checklistId - The ID of the checklist item to toggle
   */
  const handleChecklistToggle = (checklistId: string) => {
    if (!task) return;
    setTask({
      ...task,
      checklist: task.checklist.map((item) =>
        item.id === checklistId ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  /**
   * Returns the CSS classes for priority badge styling based on priority level
   * @param priority - The priority level ("high", "medium", "low")
   * @returns CSS class string for the priority badge background and text color
   */
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

  /**
   * Returns the appropriate icon component for the priority level
   * @param priority - The priority level ("high", "medium", "low")
   * @returns JSX element representing the priority icon
   */
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-5 w-5" />;
      case "medium":
        return <Clock className="h-5 w-5" />;
      case "low":
        return <CheckSquare className="h-5 w-5" />;
      default:
        return <CheckSquare className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Task not found</h2>
          <p className="text-gray-600 mb-4">
            The task you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/apps/tasks")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with Back Button */}
      <div className=" px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/apps/tasks")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <h1 className="hidden lg:flex text-xl font-semibold">Task Details</h1>
        </div>
      </div>

      <Alert variant={"primary"} className="my-4">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Ideally you should use the TaskDetails drawer already created but you
          can also use this if you need a new page use case.
        </AlertDescription>
      </Alert>

      <div className="rounded-md border mx-auto p-6">
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
                The task you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Task Header */}
            <div className="p-0 lg:p-6 border-b">
              <div className="flex flex-col lg:flex-row gap-4 items-start justify-between mb-4">
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
                    <p className="text-gray-600 dark:text-muted-foreground mt-2">
                      {task.description}
                    </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
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
                        <div className="w-full bg-gray-200 dark:bg-secondary rounded-full h-3">
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
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary"
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

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col lg:flex-row gap-3">
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
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
          </div>
        )}
      </div>
    </div>
  );
}
