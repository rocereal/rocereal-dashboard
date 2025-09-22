import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { coursesData } from "@/data/education";
import { ArrowLeft, Award, BookOpen } from "lucide-react";
import Link from "next/link";
import { CourseHero } from "../(components)/CourseHero";
import { CourseOverview } from "../(components)/CourseOverview";
import { CourseCurriculum } from "../(components)/CourseCurriculum";
import { CourseSidebar } from "../(components)/CourseSidebar";
import { RelatedCourses } from "../(components)/RelatedCourses";
import { findCourseBySlug } from "../utils";

export const metadata = {
  title: "Course Details | LMS",
  description: "Learn and track your progress through interactive courses",
};

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.courseId;

  // Find the course by slug (supports both courseId and readable slugs)
  const course = findCourseBySlug(slug);

  if (!course) {
    return (
      <div className="flex flex-col space-y-6">
        <DashboardHeader
          title="Course Not Found"
          subtitle="The requested course could not be found"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "LMS", href: "/apps/lms" },
            { label: "Courses", href: "/apps/lms" },
            { label: "Not Found" },
          ]}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Course not found.</p>
          <Link href="/apps/lms">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock user progress - in a real app, this would come from the database
  // For demo purposes, simulate progress for courses that would appear in EnrolledCourses
  const mockUserProgress: { [lessonId: string]: boolean } = {};
  let userProgressPercentage = 0;

  // Simulate enrollment and progress for courses that would be in EnrolledCourses
  // In a real app, this would check if the user has progress on this course
  const enrolledCourseIds = [
    "intro-data-science",
    "web-development-basics",
    "business-analytics",
  ]; // Mock enrolled courses
  const isEnrolled = enrolledCourseIds.includes(course.courseId);

  if (isEnrolled && course.curriculum) {
    // Simulate varying completion levels for enrolled courses
    const progressLevels = {
      "intro-data-science": 0.6,
      "web-development-basics": 0.3,
      "business-analytics": 0.8,
    };
    const progress =
      progressLevels[course.courseId as keyof typeof progressLevels] || 0.5;
    userProgressPercentage = Math.round(progress * 100);

    const completedCount = Math.floor(course.curriculum.length * progress);
    course.curriculum.slice(0, completedCount).forEach((lesson) => {
      mockUserProgress[lesson.id] = true;
    });
  }

  // Get related courses (excluding current course)
  const relatedCourses = coursesData
    .filter((c) => c.courseId !== course.courseId)
    .slice(0, 3);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={course.title}
        subtitle={course.description}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "LMS", href: "/apps/lms" },
          { label: "Courses", href: "/apps/lms" },
          { label: course.title },
        ]}
        primaryAction={{
          label: isEnrolled ? "Continue Learning" : "Enroll Now",
          icon: <BookOpen className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Share Course",
          icon: <Award className="h-4 w-4" />,
        }}
      />

      {/* Course Hero Section */}
      <CourseHero
        course={course}
        isEnrolled={isEnrolled}
        progress={isEnrolled ? userProgressPercentage : 0}
      />

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <CourseOverview course={course} />
          <CourseCurriculum
            course={course}
            isEnrolled={isEnrolled}
            userProgress={mockUserProgress}
          />
          <RelatedCourses courses={relatedCourses} />
        </div>

        {/* Sidebar */}
        <CourseSidebar
          course={course}
          isEnrolled={isEnrolled}
          userProgress={mockUserProgress}
        />
      </div>
    </div>
  );
}
