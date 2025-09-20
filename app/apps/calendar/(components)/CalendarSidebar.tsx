"use client";

import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarSidebarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  onMonthChange: (date: Date) => void;
  onNavigateMonth: (direction: "prev" | "next") => void;
  formatMonthYear: (date: Date) => string;
}

export function CalendarSidebar({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onNavigateMonth,
  formatMonthYear,
}: CalendarSidebarProps) {
  return (
    <div className="w-full lg:w-80 border-r p-0 lg:p-2 space-y-6">
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
                onClick={() => onNavigateMonth("prev")}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateMonth("next")}
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
            onSelect={(date) => onDateSelect(date || null)}
            month={currentDate}
            onMonthChange={onMonthChange}
            className="rounded-md border-0 w-full"
          />
        </CardContent>
      </Card>

      {/* My Calendars */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">My calendars</CardTitle>
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
  );
}
