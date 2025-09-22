"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseData } from "@/data/education";
import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CurriculumLesson } from "./CurriculumLesson";
import {
  calculateCurriculumProgress,
  getNextLesson,
  getProgressText,
} from "../utils/curriculum-utils";

interface CourseCurriculumProps {
  course: CourseData;
  isEnrolled?: boolean;
  userProgress?: { [lessonId: string]: boolean };
}

export function CourseCurriculum({
  course,
  isEnrolled = false,
  userProgress = {},
}: CourseCurriculumProps) {
  if (!course.curriculum || course.curriculum.length === 0) {
    return null;
  }

  // For non-enrolled users, show only first 3 lessons as preview
  const lessonsToShow = isEnrolled
    ? course.curriculum
    : course.curriculum.slice(0, 3);

  const progress = calculateCurriculumProgress(course.curriculum, userProgress);
  const nextLesson = getNextLesson(course.curriculum, userProgress);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Curriculum
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {isEnrolled && (
              <div className="text-sm text-muted-foreground">
                {getProgressText(progress)}
              </div>
            )}
            <Link href={`/apps/lms/${course.courseId}/curriculum`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                {isEnrolled ? "View Full Curriculum" : "Preview Curriculum"}
              </Button>
            </Link>
          </div>
        </div>
        {isEnrolled && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lessonsToShow.map((lesson, index) => {
            const isCompleted = Boolean(
              userProgress[lesson.id] || lesson.completed
            );
            const isNext = nextLesson?.id === lesson.id || false;

            return (
              <CurriculumLesson
                key={lesson.id}
                lesson={lesson}
                index={index}
                isEnrolled={isEnrolled}
                isCompleted={isCompleted}
                isNextLesson={isNext}
                showPreviewBadge={!isEnrolled}
                onLessonClick={(lesson) => {
                  console.log("Lesson clicked:", lesson.title);
                  // Handle lesson navigation here
                }}
              />
            );
          })}

          {!isEnrolled && course.curriculum.length > 3 && (
            <div className="text-center py-4 border-t">
              <div className="text-sm text-muted-foreground mb-2">
                +{course.curriculum.length - 3} more lessons available
              </div>
              <div className="text-xs text-muted-foreground">
                Enroll to access the full curriculum
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
