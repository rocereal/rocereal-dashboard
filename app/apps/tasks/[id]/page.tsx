"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckSquare,
  Clock,
  Edit,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
  assignee: string;
  tags: string[];
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

// Mock tasks data (same as in TasksList)
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description:
      "Create a modern, responsive landing page for the new product launch",
    completed: false,
    priority: "high",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15",
    assignee: "John Doe",
    tags: ["design", "frontend", "urgent"],
    checklist: [
      { id: "1", text: "Create wireframes", completed: true },
      { id: "2", text: "Design mockups", completed: false },
      { id: "3", text: "Get client approval", completed: false },
    ],
  },
  {
    id: "2",
    title: "Fix authentication bug",
    description: "Users are unable to login with social media accounts",
    completed: true,
    priority: "high",
    dueDate: "2024-01-18",
    createdAt: "2024-01-16",
    assignee: "Jane Smith",
    tags: ["bug", "backend", "security"],
    checklist: [
      { id: "1", text: "Identify root cause", completed: true },
      { id: "2", text: "Implement fix", completed: true },
      { id: "3", text: "Test thoroughly", completed: true },
    ],
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints for the mobile app",
    completed: false,
    priority: "medium",
    dueDate: "2024-01-25",
    createdAt: "2024-01-17",
    assignee: "Bob Johnson",
    tags: ["documentation", "api"],
    checklist: [
      { id: "1", text: "List all endpoints", completed: true },
      { id: "2", text: "Write descriptions", completed: false },
      { id: "3", text: "Add examples", completed: false },
    ],
  },
];

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
            The task you're looking for doesn't exist.
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/apps/tasks")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleTaskToggle}
                className="mt-1"
              />
              <div>
                <h1
                  className={cn(
                    "text-3xl font-bold",
                    task.completed && "line-through text-gray-500"
                  )}
                >
                  {task.title}
                </h1>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>
            </div>
            <Badge
              className={cn(
                "text-sm px-3 py-1",
                getPriorityColor(task.priority)
              )}
            >
              {getPriorityIcon(task.priority)}
              <span className="ml-2 capitalize">{task.priority}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      {task.checklist.filter((item) => item.completed).length} /{" "}
                      {task.checklist.length}
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

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
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
                    <Badge variant={task.completed ? "default" : "secondary"}>
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
                      <Badge key={tag} variant="outline" className="text-xs">
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
    </div>
  );
}
