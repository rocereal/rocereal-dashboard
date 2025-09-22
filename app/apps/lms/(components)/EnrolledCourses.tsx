"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData, EducationMetric } from "@/data/education";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Book,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CurriculumLesson } from "./CurriculumLesson";

interface EnrolledCoursesProps {
  metrics?: EducationMetric[];
  courses?: CourseData[];
  className?: string;
  userProgress?: { [courseId: string]: number }; // Progress percentage for each course
}

export function EnrolledCourses({
  metrics,
  courses,
  className,
  userProgress = {},
}: EnrolledCoursesProps) {
  const [expandedCourses] = useState<Set<string>>(new Set());

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "graduation-cap":
        return GraduationCap;
      default:
        return GraduationCap; // fallback
    }
  };

  // If courses are provided, show course cards
  if (courses && courses.length > 0) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {courses.map((course) => {
          const IconComponent = getIconComponent(course.icon);
          const isExpanded = expandedCourses.has(course.courseId);

          // In EnrolledCourses, all courses are continuing
          const userCourseProgress = userProgress[course.courseId] || 0;

          console.log(course);
          return (
            <Card
              key={course.courseId}
              className="relative overflow-hidden border !bg-card shadow-xs backdrop-blur-sm"
            >
              <div className="relative overflow-hidden aspect-video w-full flex flex-col">
                <ImageComponentOptimized
                  unoptimized={true}
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-2 right-2">
                  {IconComponent && (
                    <IconComponent className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Show user progress with green bar for enrolled courses */}
                <div className="absolute bottom-0 w-full bg-muted rounded-none h-1">
                  <div
                    className="h-1 rounded-r-full transition-all duration-300 bg-primary"
                    style={{
                      width: `${userCourseProgress}%`,
                    }}
                  />
                </div>

                {/* Show continuing badge for all enrolled courses */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary text-white text-xs">
                    Continuing
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 justify-between align-middle">
                    <div className="flex flex-col items-start justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Enrolled</span>
                      </div>
                      <span className="font-medium">{course.enrolled}</span>
                    </div>
                    <div className="flex flex-col items-end justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Your Progress
                        </span>
                      </div>
                      <span className="font-medium">{userCourseProgress}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 justify-between align-middle">
                    <div className="flex flex-col items-start justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Book className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lessons</span>
                      </div>
                      <span className="font-medium">{course.courses}</span>
                    </div>
                    <div className="flex flex-col items-end justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Rating</span>
                      </div>
                      <span className="font-medium">{course.avgRating}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      shallow={true}
                      href="/apps/lms/[courseId]"
                      as={`/apps/lms/${course?.courseId}`}
                      passHref
                      style={{ textDecoration: "none" }}
                      className="cursor-pointer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        Continue Course
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Otherwise show metrics cards
  const displayMetrics = metrics || [];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {displayMetrics.map((metric) => {
        const IconComponent = metric.icon;
        const isPositive = metric.changeType === "positive";

        return (
          <Card
            key={metric.id}
            className="relative overflow-hidden border !bg-card shadow-xs backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {IconComponent && (
                  <div className="bg-primary/20 size-8 items-center rounded-full flex justify-center">
                    <IconComponent className="h-3 w-3 rounded-full text-primary" />
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {metric.value}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs flex items-center gap-1",
                    isPositive
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
