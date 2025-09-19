"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { coursesData, recommendedCourses } from "@/data/education";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { RecommendedCourses } from "./RecommendedCourses";
import { SectionCards } from "./SectionCards";

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Education Dashboard"
        subtitle="Monitor course performance, student engagement, and learning outcomes."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Education Dashboard" },
        ]}
        primaryAction={{
          label: "Add Course",
          icon: <BookOpen className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SectionCards courses={coursesData} />

      <RecommendedCourses courses={recommendedCourses} />
    </div>
  );
}
