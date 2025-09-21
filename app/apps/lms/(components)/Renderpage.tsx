"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { coursesData, recommendedCourses } from "@/data/education";
import { BookOpen, ChartBar } from "lucide-react";
import { RecommendedCourses } from "./RecommendedCourses";
import { SectionCards } from "./SectionCards";

export default function RenderPage() {
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
        secondaryAction={{
          label: "Download Report",
          icon: <ChartBar className="h-4 w-4" />,
        }}
      />

      <SectionCards courses={coursesData} />

      <RecommendedCourses courses={recommendedCourses} />
    </div>
  );
}
