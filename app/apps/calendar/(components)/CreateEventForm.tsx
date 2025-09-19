"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarEvent } from "@/data/calendar";

interface CreateEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (event: Partial<CalendarEvent>) => void;
}

export function CreateEventForm({
  open,
  onOpenChange,
  onSubmit,
}: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    attendees: "",
    type: "",
    priority: "",
    color: "#3b82f6",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      return; // Basic validation
    }

    // Combine date and time
    const startDateTime =
      formData.startDate && formData.startTime
        ? new Date(`${formData.startDate}T${formData.startTime}`)
        : undefined;

    const endDateTime =
      formData.endDate && formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}`)
        : undefined;

    const eventData: Partial<CalendarEvent> = {
      id: Date.now().toString(), // Simple ID generation
      title: formData.title,
      description: formData.description || undefined,
      start: startDateTime || new Date(),
      end: endDateTime || new Date(),
      location: formData.location || undefined,
      attendees: formData.attendees
        ? formData.attendees
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean)
        : undefined,
      type: (formData.type as CalendarEvent["type"]) || "event",
      priority: (formData.priority as CalendarEvent["priority"]) || "medium",
      color: formData.color,
    };

    onSubmit?.(eventData);

    // Reset form
    setFormData({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      attendees: "",
      type: "",
      priority: "",
      color: "#3b82f6",
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      attendees: "",
      type: "",
      priority: "",
      color: "#3b82f6",
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] flex flex-col"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Create New Event</SheetTitle>
          <SheetDescription>Add a new event to your calendar</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              className="w-full"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description (optional)"
              className="w-full min-h-[80px]"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <Label>Date & Time</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  className="w-full"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  className="w-full"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  className="w-full"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  className="w-full"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter location (optional)"
              className="w-full"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees</Label>
            <Textarea
              id="attendees"
              placeholder="Enter email addresses separated by commas (optional)"
              className="w-full min-h-[60px]"
              value={formData.attendees}
              onChange={(e) => handleInputChange("attendees", e.target.value)}
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="event-type">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => handleInputChange("color", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="#3b82f6">Blue</SelectItem>
                <SelectItem value="#10b981">Green</SelectItem>
                <SelectItem value="#f59e0b">Orange</SelectItem>
                <SelectItem value="#ef4444">Red</SelectItem>
                <SelectItem value="#8b5cf6">Purple</SelectItem>
                <SelectItem value="#06b6d4">Cyan</SelectItem>
                <SelectItem value="#ec4899">Pink</SelectItem>
                <SelectItem value="#84cc16">Lime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
              className="bg-primary"
            >
              Create Event
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
