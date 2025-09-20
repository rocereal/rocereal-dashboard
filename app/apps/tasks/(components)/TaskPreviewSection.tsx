"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Calendar, User } from "lucide-react";
import { AlertCircle, Clock } from "lucide-react";

interface TaskPreviewSectionProps {
  title: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}

export default function TaskPreviewSection({
  title,
  priority,
  assignee,
  dueDate,
}: TaskPreviewSectionProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{title || "Task Title"}</span>
          </div>

          {priority && (
            <Badge className={getPriorityColor(priority)}>
              {getPriorityIcon(priority)}
              <span className="ml-1 capitalize">{priority}</span>
            </Badge>
          )}

          {assignee && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{assignee}</span>
            </div>
          )}

          {dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
