/**
 * Task Preview Section Component
 * Displays a preview of a task with its title, priority, assignee, and due date
 * Used in task creation or editing forms to show how the task will appear
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Calendar, User } from "lucide-react";
import { AlertCircle, Clock } from "lucide-react";

/**
 * Props for the TaskPreviewSection component
 * @param title - The title of the task to display
 * @param priority - The priority level of the task (low, medium, high)
 * @param assignee - The name of the person assigned to the task
 * @param dueDate - The due date of the task as a string
 */
interface TaskPreviewSectionProps {
  title: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}

/**
 * TaskPreviewSection component for displaying task preview
 * Renders a card with task details including title, priority badge, assignee, and due date
 * @param title - The title of the task
 * @param priority - The priority level of the task
 * @param assignee - The assignee of the task
 * @param dueDate - The due date of the task
 * @returns JSX element representing the task preview section
 */
export default function TaskPreviewSection({
  title,
  priority,
  assignee,
  dueDate,
}: TaskPreviewSectionProps) {
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
