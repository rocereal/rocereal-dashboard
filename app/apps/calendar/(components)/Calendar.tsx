"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Video,
  Phone,
  Mail,
  Settings,
  Calendar,
} from "lucide-react";
import { CalendarEvent, calendarEvents } from "@/data/calendar";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";

interface TeamsCalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

type ViewType = "month" | "week" | "day" | "agenda";

export default function EventsCalendar({
  events = calendarEvents,
  className,
}: TeamsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return events
      .filter((event) => event.start >= today && event.start <= nextWeek)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  };

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Teams-style Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              {formatMonthYear(currentDate)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <Input
              placeholder="Search events..."
              className="w-full shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80  border-r p-4 space-y-6">
          {/* Mini Calendar */}
          <Card className="shadow-xs w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {formatMonthYear(currentDate)}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ShadcnCalendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => setSelectedDate(date || null)}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="rounded-md border-0 w-full"
              />
            </CardContent>
          </Card>

          {/* My Calendars */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                My calendars
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Calendar", color: "#0078d4", checked: true },
                { name: "Birthdays", color: "#d83b01", checked: true },
                { name: "Holidays", color: "#107c10", checked: false },
              ].map((calendar) => (
                <div key={calendar.name} className="flex items-center gap-2">
                  <Checkbox
                    id={calendar.name}
                    defaultChecked={calendar.checked}
                    className="rounded"
                  />

                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: calendar.color }}
                  />
                  <label
                    htmlFor={calendar.name}
                    className="text-sm text-gray-700 dark:text-gray-300 flex-1"
                  >
                    {calendar.name}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar */}
        <div className="flex-1 bg-white dark:bg-gray-800">
          {/* Calendar Grid */}
          <div className="h-full flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div
                  key={day}
                  className="p-4 text-center font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-gray-50 dark:bg-gray-900"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 flex-1">
              {monthDays.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const isCurrentDay = isToday(date);
                const isInCurrentMonth = isCurrentMonth(date);

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 p-2 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                      isCurrentDay
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : !isInCurrentMonth
                        ? "bg-gray-50 dark:bg-gray-900/50"
                        : "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isCurrentDay
                          ? "text-blue-600 dark:text-blue-400 font-bold"
                          : isInCurrentMonth
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {/* Events display */}
                    {dayEvents.length > 0 && (
                      <div className="space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1.5 rounded-sm cursor-pointer hover:opacity-80 flex items-center gap-1"
                            style={{
                              backgroundColor: event.color + "15",
                              borderLeft: `3px solid ${event.color}`,
                              color: event.color,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            title={`${
                              event.title
                            } - ${event.start.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`}
                          >
                            {getMeetingIcon(event.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {event.title}
                              </div>
                              <div className="text-xs opacity-75">
                                {event.start.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
