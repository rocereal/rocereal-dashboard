"use client";

import { CalendarEvent, calendarEvents } from "@/data/calendar";
import { Calendar, Phone, Video } from "lucide-react";
import { useState } from "react";
import { CreateEventForm } from "./CreateEventForm";
import {
  CalendarHeader,
  CalendarSidebar,
  CalendarGrid,
  EventDialog,
} from "./index";

interface TeamsCalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

/**
 * Events Calendar Component
 * This is the main calendar component that renders a full-featured calendar interface
 * Manages state for current date, selected date, events, and dialog visibility
 * Provides month navigation, event creation, and event details viewing
 * Renders the calendar header, sidebar for date selection, grid for month view, and dialogs for events
 * @param events - Optional array of calendar events to display, defaults to calendarEvents from data
 * @param className - Optional CSS class name for styling the calendar container
 * @returns The JSX element representing the complete calendar interface
 */
export default function EventsCalendar({
  events = calendarEvents,
}: TeamsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isCreateEventSheetOpen, setIsCreateEventSheetOpen] = useState(false);

  /**
   * Get Events For Date
   * Filters the events array to return only events that occur on the specified date
   * Compares the event start date with the given date using date string comparison
   * @param date - The date to filter events for
   * @returns Array of CalendarEvent objects that occur on the specified date
   */
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  /**
   * Generate Month Days
   * Creates an array of 42 Date objects representing all days to display in the month view calendar
   * Starts from the previous Sunday of the first day of the month and includes 6 weeks worth of days
   * This ensures consistent grid layout regardless of which day of the week the month starts
   * @returns Array of 42 Date objects covering the full month view grid
   */
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const monthDays = generateMonthDays();

  /**
   * Navigate Month
   * Updates the current date to navigate to the previous or next month
   * Used by the calendar header navigation buttons
   * @param direction - Direction to navigate: "prev" for previous month, "next" for next month
   */
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  /**
   * Go To Today
   * Sets the current date to today's date, effectively jumping to the current month
   * Used by the "Today" button in the calendar header
   */
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  /**
   * Format Month Year
   * Formats a date object to display the full month name and year
   * Used for displaying the current month/year in the calendar header and sidebar
   * @param date - The date to format
   * @returns Formatted string like "December 2023"
   */
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  /**
   * Is Today
   * Checks if the given date is today's date
   * Used for highlighting today's date in the calendar grid
   * @param date - The date to check
   * @returns True if the date is today, false otherwise
   */
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  /**
   * Is Current Month
   * Checks if the given date belongs to the currently viewed month
   * Used for styling dates that are in the current month vs previous/next month dates
   * @param date - The date to check
   * @returns True if the date is in the current month, false otherwise
   */
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  /**
   * Get Meeting Icon
   * Returns the appropriate Lucide React icon component based on the event type
   * Maps event types to visual icons for display in the calendar grid
   * @param type - The type of event (meeting, call, event, etc.)
   * @returns JSX element of the appropriate icon component
   */
  const getMeetingIcon = (type?: string) => {
    switch (type) {
      case "meeting":
        return <Video className="h-3 w-3" />;
      case "call":
        return <Phone className="h-3 w-3" />;
      case "event":
        return <Calendar className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-card border rounded-md flex flex-col">
      {/* Teams-style Header */}
      <CalendarHeader
        currentDate={currentDate}
        onNavigateMonth={navigateMonth}
        onGoToToday={goToToday}
        onCreateEvent={() => setIsCreateEventSheetOpen(true)}
        formatMonthYear={formatMonthYear}
      />

      <div className="flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Sidebar */}
        <CalendarSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onMonthChange={setCurrentDate}
          onNavigateMonth={navigateMonth}
          formatMonthYear={formatMonthYear}
        />

        {/* Main Calendar */}
        <CalendarGrid
          monthDays={monthDays}
          events={events}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onEventSelect={(event) => {
            setSelectedEvent(event);
            setIsEventDialogOpen(true);
          }}
          getEventsForDate={getEventsForDate}
          isToday={isToday}
          isCurrentMonth={isCurrentMonth}
          getMeetingIcon={getMeetingIcon}
        />
      </div>

      {/* Event Details Dialog */}
      <EventDialog
        isOpen={isEventDialogOpen}
        event={selectedEvent}
        onClose={() => setIsEventDialogOpen(false)}
      />

      {/* Create Event Form */}
      <CreateEventForm
        open={isCreateEventSheetOpen}
        onOpenChange={setIsCreateEventSheetOpen}
        onSubmit={(eventData) => {
          console.log("New event created:", eventData);
          // Here you would typically add the event to your calendar data
          // For now, we'll just log it
        }}
      />
    </div>
  );
}
