/**
 * Related Courses Component
 * Displays a list of related courses in a card layout
 * Shows course titles, ratings, and lesson counts with clickable links
 * Used to suggest additional courses to users based on current course
 * Renders in a responsive grid format
 * @param courses - Array of related course objects to display
 * @returns The JSX element representing the related courses card
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "@/data/education";
import { Star } from "lucide-react";
import Link from "next/link";

interface RelatedCoursesProps {
  courses: CourseData[];
}

/**
 * Related Courses Component
 * Main component for displaying related courses with ratings and links
 * Renders course suggestions in a card with hover effects
 * @param courses - Array of related courses
 * @returns The rendered related courses component
 */
export function RelatedCourses({ courses }: RelatedCoursesProps) {
  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <Link
              key={index}
              shallow={true}
              href="/apps/lms/[courseId]"
              as={`/apps/lms/${course?.courseId}`}
              passHref
              style={{ textDecoration: "none" }}
              className="cursor-pointer"
            >
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2">{course.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{course.avgRating}</span>
                  <span>•</span>
                  <span>{course.courses}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
