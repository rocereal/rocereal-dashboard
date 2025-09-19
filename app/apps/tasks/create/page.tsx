"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ArrowLeft,
  X,
  CheckSquare,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Tag,
} from "lucide-react";

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
    console.log("Creating task:", newTask);

    // Navigate back to tasks list
    router.push("/apps/tasks");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/apps/tasks")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Plus className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Create New Task</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
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
                    value={taskData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={taskData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Checklist
                  <Badge variant="outline" className="ml-auto">
                    {checklistItems.length} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Checklist Item */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add checklist item"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddChecklistItem();
                      }
                    }}
                  />
                  <Button onClick={handleAddChecklistItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Checklist Items */}
                {checklistItems.length > 0 && (
                  <div className="space-y-2">
                    {checklistItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm flex-1">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveChecklistItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Task Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={taskData.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      handleInputChange("priority", value)
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
                    value={taskData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    placeholder="Enter assignee name"
                    value={taskData.assignee}
                    onChange={(e) =>
                      handleInputChange("assignee", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                  <Badge variant="outline" className="ml-auto">
                    {taskData.tags.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Tag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tags List */}
                {taskData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {taskData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">
                      {taskData.title || "Task Title"}
                    </span>
                  </div>

                  {taskData.priority && (
                    <Badge className={getPriorityColor(taskData.priority)}>
                      {getPriorityIcon(taskData.priority)}
                      <span className="ml-1 capitalize">
                        {taskData.priority}
                      </span>
                    </Badge>
                  )}

                  {taskData.assignee && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{taskData.assignee}</span>
                    </div>
                  )}

                  {taskData.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(taskData.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/apps/tasks")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!taskData.title.trim()}
              >
                Create Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
