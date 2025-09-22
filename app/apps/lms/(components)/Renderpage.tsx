"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { coursesData, recommendedCourses } from "@/data/education";
import { BookOpen, ChartBar } from "lucide-react";
import { RecommendedCourses } from "./RecommendedCourses";
import { EnrolledCourses } from "./EnrolledCourses";

export default function RenderPage() {
  // Mock user progress data - in a real app, this would come from user authentication/session
  const mockUserProgress: { [courseId: string]: number } = {
    "intro-data-science": 60,
    "web-development-basics": 30,
    "business-analytics": 80,
  };

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

      <EnrolledCourses
        courses={coursesData.slice(0, 3)}
        userProgress={mockUserProgress}
      />

      <RecommendedCourses courses={recommendedCourses} />
    </div>
  );
}
