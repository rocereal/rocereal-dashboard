"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, CheckSquare, Clock, User } from "lucide-react";
import { useState } from "react";
import {
  Task,
  mockTasks,
  getPriorityColor,
  getPriorityIcon,
} from "@/data/tasks";

interface TasksListProps {
  onTaskSelect: (taskId: string) => void;
}

export default function TasksList({ onTaskSelect }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
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
                <div className="flex flex-col items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <CardTitle
                    className={cn(
                      "text-lg",
                      task.completed &&
                        "line-through text-gray-500 dark:text-gray-50"
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
              <p className="text-sm text-gray-600  dark:text-muted-foreground line-clamp-2">
                {task.description}
              </p>

              {/* Checklist Progress */}
              {task.checklist.length > 0 && (
                <div className="space-y-2 ">
                  <div className="flex items-center justify-between text-xs text-gray-500  dark:text-muted-foreground">
                    <span>Checklist</span>
                    <span>
                      {task.checklist.filter((item) => item.completed).length} /{" "}
                      {task.checklist.length}
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
