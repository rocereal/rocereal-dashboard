"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Task } from "@/data/tasks";
import BasicInfoSection from "./BasicInfoSection";
import ChecklistSection from "./ChecklistSection";
import TaskSettingsSection from "./TaskSettingsSection";
import TagsSection from "./TagsSection";
import TaskPreviewSection from "./TaskPreviewSection";
import FormActionsSection from "./FormActionsSection";

interface CreateTaskDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (task: Task) => void;
}

export default function CreateTaskDrawer({
  isOpen,
  onOpenChange,
  onTaskCreated,
}: CreateTaskDrawerProps) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    assignee: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTaskData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems((prev) => [...prev, newChecklistItem.trim()]);
      setNewChecklistItem("");
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!taskData.title.trim()) {
      return; // Basic validation
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      completed: false,
      priority: taskData.priority,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      assignee: taskData.assignee.trim(),
      tags: taskData.tags,
      checklist: checklistItems.map((item, index) => ({
        id: `item-${index}`,
        text: item,
        completed: false,
      })),
    };

    // Call the callback if provided
    if (onTaskCreated) {
      onTaskCreated(newTask);
    }

    // Reset form
    setTaskData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: "",
      tags: [],
    });
    setChecklistItems([]);
    setNewTag("");
    setNewChecklistItem("");

    // Close drawer
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[700px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Task
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <BasicInfoSection
                title={taskData.title}
                description={taskData.description}
                onTitleChange={(value) => handleInputChange("title", value)}
                onDescriptionChange={(value) =>
                  handleInputChange("description", value)
                }
              />

              <ChecklistSection
                checklistItems={checklistItems}
                newChecklistItem={newChecklistItem}
                onNewChecklistItemChange={setNewChecklistItem}
                onAddChecklistItem={handleAddChecklistItem}
                onRemoveChecklistItem={handleRemoveChecklistItem}
              />

              <TaskSettingsSection
                priority={taskData.priority}
                dueDate={taskData.dueDate}
                assignee={taskData.assignee}
                onPriorityChange={(value) =>
                  handleInputChange("priority", value)
                }
                onDueDateChange={(value) => handleInputChange("dueDate", value)}
                onAssigneeChange={(value) =>
                  handleInputChange("assignee", value)
                }
              />

              <TagsSection
                tags={taskData.tags}
                newTag={newTag}
                onNewTagChange={setNewTag}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />

              <TaskPreviewSection
                title={taskData.title}
                priority={taskData.priority}
                assignee={taskData.assignee}
                dueDate={taskData.dueDate}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t p-6">
            <FormActionsSection
              onCancel={() => onOpenChange(false)}
              onSubmit={handleSubmit}
              isValid={!!taskData.title.trim()}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
