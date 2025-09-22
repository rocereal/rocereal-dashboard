"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
  onCreateEvent: () => void;
  formatMonthYear: (date: Date) => string;
}

/**
 * Calendar Header Component
 * Renders the header section of the calendar with navigation controls and action buttons
 * Includes previous/next month buttons, today button, month/year display, search input, and create event button
 * Provides responsive layout that adapts to different screen sizes
 * @param currentDate - The current date being displayed in the calendar
 * @param onNavigateMonth - Callback function to navigate to previous or next month
 * @param onGoToToday - Callback function to jump to today's date
 * @param onCreateEvent - Callback function to open the create event form
 * @param formatMonthYear - Function to format the date as month and year string
 * @returns The JSX element representing the calendar header
 */
export function CalendarHeader({
  currentDate,
  onNavigateMonth,
  onGoToToday,
  onCreateEvent,
  formatMonthYear,
}: CalendarHeaderProps) {
  return (
    <div className="border-b px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex items-center gap-2 w-full lg:w-fit">
            <Button variant="outline" onClick={() => onNavigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onGoToToday}>
              Today
            </Button>
            <Button variant="outline" onClick={() => onNavigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="hidden lg:flex text-xl font-medium text-gray-700 dark:text-gray-300">
            {formatMonthYear(currentDate)}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search */}
          <Input placeholder="Search events..." className="w-full shadow-xs" />

          <Button
            className="bg-primary w-full lg:w-fit"
            onClick={onCreateEvent}
          >
            <Plus className="h-4 w-4 mr-2" />
            New meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
