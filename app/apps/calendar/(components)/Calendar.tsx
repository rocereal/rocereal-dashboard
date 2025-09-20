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

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Generate calendar days for month view
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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

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
