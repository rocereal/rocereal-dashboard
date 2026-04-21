"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import {
  educationMetrics,
  studentEngagementData,
  timeSpentByCourseData,
} from "@/data/education";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { AdsManagerTable } from "@/app/(dashboards)/education/(components)/AdsManagerTable";
import { SectionCards } from "@/app/(dashboards)/education/(components)/SectionCards";
import { StudentEngagementChart } from "@/app/(dashboards)/education/(components)/StudentEngagementChart";
import { TimeSpentChart } from "@/app/(dashboards)/education/(components)/TimeSpentChart";

export default function RenderPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>({ from: today, to: todayEnd });

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Facebook Ads"
        subtitle="Track student progress, course performance, and engagement across programs."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Canale Marketing", href: "/education" },
          { label: "Facebook Ads" },
        ]}
        primaryAction={{
          label: "Add Course",
          icon: <BookOpen className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SectionCards metrics={educationMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Student Engagement</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Active learners per week over the past 12 weeks
          </p>
          <StudentEngagementChart data={studentEngagementData} />
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Time Spent on Platform</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Average time spent by course (in hours)
          </p>
          <TimeSpentChart data={timeSpentByCourseData} />
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Students Enrolled</h3>
            <span className="text-sm text-muted-foreground">
              Date din Facebook Ads · rocereal sibiu
            </span>
          </div>
          <AdsManagerTable dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}
