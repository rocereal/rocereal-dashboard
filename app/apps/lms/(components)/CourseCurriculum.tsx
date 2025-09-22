"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "@/data/education";
import { BookOpen } from "lucide-react";
import {
  calculateCurriculumProgress,
  getNextLesson,
  getProgressText,
} from "../utils/curriculum-utils";
import { CurriculumLesson } from "./CurriculumLesson";

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
  console.log("CourseCurriculum rendering:", {
    isEnrolled,
    courseTitle: course.title,
  });

  if (!course.curriculum || course.curriculum.length === 0) {
    return null;
  }

  // Show full curriculum for all users
  const lessonsToShow = course.curriculum;

  const progress = calculateCurriculumProgress(course.curriculum, userProgress);
  const nextLesson = getNextLesson(course.curriculum, userProgress);

  const handleLessonClick = (lesson: any) => {
    // Handle lesson clicks - for now, just log
    console.log("Lesson clicked:", lesson.title);
    // In a real app, this would navigate to lesson content or show preview
  };

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
                onLessonClick={handleLessonClick}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
