"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Task } from "@/data/tasks";
import BasicInfoSection from "../(components)/BasicInfoSection";
import ChecklistSection from "../(components)/ChecklistSection";
import TaskSettingsSection from "../(components)/TaskSettingsSection";
import TagsSection from "../(components)/TagsSection";
import TaskPreviewSection from "../(components)/TaskPreviewSection";
import FormActionsSection from "../(components)/FormActionsSection";

export default function CreateTaskPage() {
  const router = useRouter();
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

    // Here you would typically save to your backend
    console.log("Task created:", newTask);

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

    // Navigate back to tasks
    router.push("/apps/tasks");
  };

  const handleCancel = () => {
    router.push("/apps/tasks");
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className=" border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/apps/tasks")}
          >
            ← Back to Tasks
          </Button>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
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
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              isValid={!!taskData.title.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
