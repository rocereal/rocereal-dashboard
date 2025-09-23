/**
 * CreateTaskDrawer Component
 * Drawer component for creating new tasks with comprehensive form sections and validation
 * Manages task creation state including basic info, checklist, settings, and tags
 * Provides a multi-section form with preview and handles task creation submission
 * @returns The create task drawer component
 */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Task } from "@/data/tasks";
import { Plus } from "lucide-react";
import { useState } from "react";
import BasicInfoSection from "./BasicInfoSection";
import ChecklistSection from "./ChecklistSection";
import FormActionsSection from "./FormActionsSection";
import TagsSection from "./TagsSection";
import TaskPreviewSection from "./TaskPreviewSection";
import TaskSettingsSection from "./TaskSettingsSection";

interface CreateTaskDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (task: Task) => void;
}

/**
 * CreateTaskDrawer function component
 * Renders a comprehensive task creation form in a slide-out drawer
 * Manages form state and handles task creation with validation
 * @param isOpen - Whether the drawer is open
 * @param onOpenChange - Callback to control drawer visibility
 * @param onTaskCreated - Optional callback when a task is successfully created
 * @returns JSX element for the create task drawer
 */
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

  /**
   * Handles input field changes for task data
   * Updates the task data state for the specified field
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: string, value: string) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handles adding a new tag to the task
   * Adds the tag if it's not empty and not already in the list
   */
  const handleAddTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  /**
   * Handles removing a tag from the task
   * Filters out the specified tag from the tags array
   * @param tagToRemove - The tag to remove
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setTaskData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  /**
   * Handles adding a new checklist item
   * Adds the item if it's not empty
   */
  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems((prev) => [...prev, newChecklistItem.trim()]);
      setNewChecklistItem("");
    }
  };

  /**
   * Handles removing a checklist item by index
   * Filters out the item at the specified index
   * @param index - The index of the item to remove
   */
  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Handles form submission and task creation
   * Validates required fields, creates the task object, and calls the callback
   */
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
