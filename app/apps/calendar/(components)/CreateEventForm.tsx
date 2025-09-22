"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { CalendarEvent } from "@/data/calendar";
import { useState } from "react";

interface CreateEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (event: Partial<CalendarEvent>) => void;
}

/**
 * Create Event Form Component
 * Renders a slide-out form sheet for creating new calendar events
 * Includes comprehensive form fields for event details including title, description, date/time, location, attendees, type, priority, and color
 * Manages form state internally and provides validation for required fields
 * Submits event data to parent component and resets form upon successful creation
 * @param open - Boolean indicating whether the form sheet is open
 * @param onOpenChange - Callback function to control the sheet's open/close state
 * @param onSubmit - Optional callback function called when the form is submitted with the new event data
 * @returns The JSX element representing the create event form sheet
 */
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

  /**
   * Handle Input Change
   * Updates the form data state when any input field value changes
   * Dynamically updates the specified field with the new value
   * @param field - The name of the form field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle Submit
   * Processes the form submission, validates required fields, and creates a new event
   * Combines date and time fields into Date objects, parses attendees, and calls the onSubmit callback
   * Resets the form and closes the sheet after successful submission
   * Performs basic validation on the event title
   */
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

  /**
   * Handle Cancel
   * Cancels the form submission and closes the sheet without creating an event
   * Resets all form fields to their initial empty/default state
   * Called when the user clicks the Cancel button
   */
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
      <SheetContent side="right" className="w-[400px] sm:w-full flex flex-col">
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
                <SelectItem value="#3b82f6">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#3b82f6] rounded-full" />
                    Blue
                  </div>
                </SelectItem>
                <SelectItem value="#10b981">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#10b981] rounded-full" />
                    <span>Green</span>
                  </div>
                </SelectItem>

                <SelectItem value="#f59e0b">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#f59e0b] rounded-full" />
                    <span>Orange</span>
                  </div>
                </SelectItem>

                <SelectItem value="#ef4444">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#ef4444] rounded-full" />
                    <span>Red</span>
                  </div>
                </SelectItem>

                <SelectItem value="#8b5cf6">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#8b5cf6] rounded-full" />
                    <span>Purple</span>
                  </div>
                </SelectItem>

                <SelectItem value="#06b6d4">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#06b6d4] rounded-full" />
                    <span>Cyan</span>
                  </div>
                </SelectItem>

                <SelectItem value="#ec4899">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#ec4899] rounded-full" />
                    <span>Pink</span>
                  </div>
                </SelectItem>

                <SelectItem value="#84cc16">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-2 bg-[#84cc16] rounded-full" />
                    <span>Lime</span>
                  </div>
                </SelectItem>
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
