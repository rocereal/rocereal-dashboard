"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, CheckSquare, Clock, User } from "lucide-react";
import { useState } from "react";

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

interface TasksListProps {
  onTaskSelect: (taskId: string) => void;
}

// Mock tasks data
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

export default function TasksList({ onTaskSelect }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
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

  return (
    <div className="flex-1 p-6">
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
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <CardTitle
                    className={cn(
                      "text-lg",
                      task.completed && "line-through text-gray-500"
                    )}
                  >
                    {task.title}
                  </CardTitle>
                </div>
                <Badge
                  className={cn("text-xs", getPriorityColor(task.priority))}
                >
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1 capitalize">{task.priority}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>

              {/* Checklist Progress */}
              {task.checklist.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Checklist</span>
                    <span>
                      {task.checklist.filter((item) => item.completed).length} /{" "}
                      {task.checklist.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
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
    </div>
  );
}
