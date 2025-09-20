import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { coursesData } from "@/data/education";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { findCourseBySlug } from "../../utils";

export const metadata = {
  title: "Course Curriculum | LMS",
  description: "View and navigate through course lessons",
};

export default async function CourseCurriculumPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.courseId;

  // Find the course by slug
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

  // Mock enrollment status - in a real app, this would come from user authentication/session
  const isEnrolled = course.courseId === "intro-data-science";

  // Mock user progress - in a real app, this would come from the database
  const mockUserProgress: { [lessonId: string]: boolean } = {};
  if (isEnrolled && course.curriculum) {
    // Simulate 60% completion for enrolled users
    const completedCount = Math.floor(course.curriculum.length * 0.6);
    course.curriculum.slice(0, completedCount).forEach((lesson) => {
      mockUserProgress[lesson.id] = true;
    });
  }

  if (!isEnrolled) {
    return (
      <div className="flex flex-col space-y-6">
        <DashboardHeader
          title={`${course.title} - Curriculum`}
          subtitle="Access restricted - please enroll to view curriculum"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "LMS", href: "/apps/lms" },
            { label: "Courses", href: "/apps/lms" },
            { label: course.title, href: `/apps/lms/${course.courseId}` },
            { label: "Curriculum" },
          ]}
        />

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Curriculum Access Restricted
              </h3>
              <p className="text-muted-foreground mb-4">
                You need to enroll in this course to access the full curriculum
                and start learning.
              </p>
              <div className="flex justify-center gap-4">
                <Link href={`/apps/lms/${course.courseId}`}>
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Course
                  </Button>
                </Link>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedLessons =
    Object.values(mockUserProgress).filter(Boolean).length;
  const totalLessons = course.curriculum?.length || 0;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Group lessons by type for better organization
  const lessonsByType =
    course.curriculum?.reduce((acc, lesson) => {
      if (!acc[lesson.type]) {
        acc[lesson.type] = [];
      }
      acc[lesson.type].push(lesson);
      return acc;
    }, {} as Record<string, typeof course.curriculum>) || {};

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={`${course.title} - Curriculum`}
        subtitle={`Track your progress and navigate through lessons`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "LMS", href: "/apps/lms" },
          { label: "Courses", href: "/apps/lms" },
          { label: course.title, href: `/apps/lms/${course.courseId}` },
          { label: "Curriculum" },
        ]}
        primaryAction={{
          label: "Continue Learning",
          icon: <Play className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Back to Course",
          icon: <ArrowLeft className="h-4 w-4" />,
        }}
      />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(progressPercentage)}%
            </div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lessons Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedLessons} / {totalLessons}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLessons - completedLessons} lessons
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Curriculum Sections */}
      <div className="space-y-6">
        {Object.entries(lessonsByType).map(([type, lessons]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                {type === "video" && <Play className="h-5 w-5" />}
                {type === "quiz" && <CheckCircle className="h-5 w-5" />}
                {type === "assignment" && <FileText className="h-5 w-5" />}
                {type === "reading" && <BookOpen className="h-5 w-5" />}
                {type} Lessons ({lessons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessons.map((lesson, index) => {
                  const isCompleted =
                    mockUserProgress[lesson.id] || lesson.completed;
                  const globalIndex =
                    course.curriculum?.findIndex((l) => l.id === lesson.id) ||
                    0;

                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? "bg-green-50 border-green-200 hover:bg-green-100"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            globalIndex + 1
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </span>
                            {isCompleted && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700"
                              >
                                <Trophy className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        ) : (
                          <Button size="sm">
                            {globalIndex === completedLessons
                              ? "Continue"
                              : "Start"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href={`/apps/lms/${course.courseId}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Classmates
            </Button>
            <Button variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              View Achievements
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
