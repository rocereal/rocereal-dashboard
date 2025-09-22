"use client";

import { CalendarEvent } from "@/data/calendar";

interface CalendarGridProps {
  monthDays: Date[];
  events: CalendarEvent[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  getMeetingIcon: (type?: string) => React.JSX.Element;
}

/**
 * Calendar Grid Component
 * Renders the month view grid of the calendar, displaying days of the month in a 7-column layout
 * Shows day headers (Sun-Sat), day numbers, and events for each day
 * Handles date selection and event selection interactions
 * Displays up to 3 events per day with color coding and icons, with overflow indicator for more events
 * @param monthDays - Array of Date objects representing all days to display in the grid (42 days for full month view)
 * @param events - Array of all calendar events to potentially display
 * @param currentDate - The current date being viewed in the calendar
 * @param selectedDate - The currently selected date, if any
 * @param onDateSelect - Callback function when a date is clicked
 * @param onEventSelect - Callback function when an event is clicked
 * @param getEventsForDate - Function to get events for a specific date
 * @param isToday - Function to check if a date is today
 * @param isCurrentMonth - Function to check if a date is in the current month being viewed
 * @param getMeetingIcon - Function to get the appropriate icon for event types
 * @returns The JSX element representing the calendar grid
 */
export function CalendarGrid({
  monthDays,
  onDateSelect,
  onEventSelect,
  getEventsForDate,
  isToday,
  isCurrentMonth,
  getMeetingIcon,
}: CalendarGridProps) {
  return (
    <div className="flex-1 bg-secondary">
      {/* Calendar Grid */}
      <div className="h-full flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {[
            { full: "Sunday", short: "Sun" },
            { full: "Monday", short: "Mon" },
            { full: "Tuesday", short: "Tue" },
            { full: "Wednesday", short: "Wed" },
            { full: "Thursday", short: "Thu" },
            { full: "Friday", short: "Fri" },
            { full: "Saturday", short: "Sat" },
          ].map((day) => (
            <div
              key={day.full}
              className="p-1 lg:p-4 text-xs lg:text-base text-center font-medium text-gray-600 dark:text-gray-400 border-r last:border-r-0 bg-secondary"
            >
              <span className="lg:hidden">{day.short}</span>
              <span className="hidden lg:block">{day.full}</span>
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
                className={`min-h-[120px] border-r border-b last:border-r-0 p-2 relative cursor-pointer hover:bg-card dark:hover:bg-card/30 ${
                  isCurrentDay
                    ? "bg-secondary"
                    : !isInCurrentMonth
                    ? "bg-card"
                    : "bg-card"
                }`}
                onClick={() => onDateSelect(date)}
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
                          onEventSelect(event);
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
  );
}
