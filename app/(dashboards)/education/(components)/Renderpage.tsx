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
import { AdsManagerTable } from "./AdsManagerTable";
import { SectionCards } from "./SectionCards";
import { StudentEngagementChart } from "./StudentEngagementChart";
import { TimeSpentChart } from "./TimeSpentChart";

/**
 * Education Render Page Component
 * This is the main rendering component for the education dashboard page
 * It displays the dashboard header, metrics cards, engagement charts, time spent charts, and recent students table
 * Provides the overall layout and functionality for the Learning Performance dashboard
 * @returns The JSX element representing the complete education dashboard page layout
 */
export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Learning Performance Dashboard"
        subtitle="Track student progress, course performance, and engagement across programs."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Learning Performance Dashboard" },
        ]}
        primaryAction={{
          label: "Add Course",
          icon: <BookOpen className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Education Metrics Cards */}
      <SectionCards metrics={educationMetrics} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Engagement Line Chart */}
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

        {/* Time Spent Bar Chart */}
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

      {/* Facebook Ads Manager Table */}
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
