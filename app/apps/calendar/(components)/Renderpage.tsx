"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import EventsCalendar from "./Calendar";

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Calendar Dashboard"
        subtitle="Stay on top of events, tasks, and team schedules with real-time insights."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Calendar Dashboard" },
        ]}
        primaryAction={{
          label: "Add Event",
          icon: <CalendarDays className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <EventsCalendar />
    </div>
  );
}
