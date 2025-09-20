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

interface TaskSettingsSectionProps {
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee: string;
  onPriorityChange: (value: "low" | "medium" | "high") => void;
  onDueDateChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
}

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
