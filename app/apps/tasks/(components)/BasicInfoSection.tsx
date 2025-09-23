/**
 * BasicInfoSection Component
 * Form section component for editing basic task information including title and description
 * Provides input fields for task title and description with proper labeling and validation
 * Used in task creation and editing forms to collect essential task details
 * @returns The basic info section component
 */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicInfoSectionProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

/**
 * BasicInfoSection function component
 * Renders form inputs for task title and description
 * Handles input changes and passes them to parent component
 * @param title - The current task title value
 * @param description - The current task description value
 * @param onTitleChange - Callback when title input changes
 * @param onDescriptionChange - Callback when description input changes
 * @returns JSX element for the basic info section
 */
export default function BasicInfoSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
