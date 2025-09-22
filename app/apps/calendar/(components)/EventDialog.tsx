"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEvent } from "@/data/calendar";
import { Clock, MapPin, Users } from "lucide-react";

interface EventDialogProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
}

/**
 * Event Dialog Component
 * Renders a modal dialog displaying detailed information about a selected calendar event
 * Shows event title, description, date/time, location, attendees, type, and priority
 * Provides a clean, organized view of all event details with appropriate icons and formatting
 * Closes when the user clicks outside or uses the close button
 * @param isOpen - Boolean indicating whether the dialog is open
 * @param event - The calendar event object to display, or null if no event is selected
 * @param onClose - Callback function to close the dialog
 * @returns The JSX element representing the event details dialog
 */
export function EventDialog({ isOpen, event, onClose }: EventDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <DialogTitle className="text-lg font-semibold">
              {event.title}
            </DialogTitle>
          </div>
          {event.description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Time Information */}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">
                {event.start.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-muted-foreground">
                {event.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {event.end && (
                  <>
                    {" - "}
                    {event.end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Location</div>
                <div className="text-muted-foreground">{event.location}</div>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm flex-1">
                <div className="font-medium mb-1">Attendees</div>
                <div className="space-y-1">
                  {event.attendees.map((attendee, index) => (
                    <div key={index} className="text-muted-foreground text-xs">
                      {attendee}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Event Type and Priority */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <div className="text-xs">
                <span className="text-muted-foreground">Type:</span>{" "}
                <span className="font-medium capitalize">{event.type}</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Priority:</span>{" "}
                <Badge
                  variant={
                    event.priority === "high"
                      ? "destructive"
                      : event.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {event.priority}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
