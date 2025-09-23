/**
 * Task Settings Section Component
 * Provides form controls for configuring task settings including priority, due date, and assignee
 * Used in task creation or editing forms to allow users to set task parameters
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, CheckSquare } from "lucide-react";

/**
 * Props for the TaskSettingsSection component
 * @param priority - The current priority level of the task
 * @param dueDate - The due date of the task as a string
 * @param assignee - The name of the person assigned to the task
 * @param onPriorityChange - Callback function when priority changes
 * @param onDueDateChange - Callback function when due date changes
 * @param onAssigneeChange - Callback function when assignee changes
 */
interface TaskSettingsSectionProps {
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee: string;
  onPriorityChange: (value: "low" | "medium" | "high") => void;
  onDueDateChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
}

/**
 * TaskSettingsSection component for configuring task parameters
 * Renders form controls for setting task priority, due date, and assignee with appropriate UI components
 * @param priority - Current priority value
 * @param dueDate - Current due date value
 * @param assignee - Current assignee value
 * @param onPriorityChange - Function to call when priority changes
 * @param onDueDateChange - Function to call when due date changes
 * @param onAssigneeChange - Function to call when assignee changes
 * @returns JSX element representing the task settings form section
 */
export default function TaskSettingsSection({
  priority,
  dueDate,
  assignee,
  onPriorityChange,
  onDueDateChange,
  onAssigneeChange,
}: TaskSettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={priority}
            onValueChange={(value: "low" | "medium" | "high") =>
              onPriorityChange(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600" />
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  High
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            placeholder="Enter assignee name"
            value={assignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
