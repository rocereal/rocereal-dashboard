/**
 * Course Curriculum Component
 * Displays the course curriculum with lessons, progress tracking, and enrollment status
 * Renders a card-based layout showing course lessons with completion status and next lesson indicators
 * Supports both enrolled and non-enrolled users with appropriate UI variations
 * @param course - The course data object containing curriculum information
 * @param isEnrolled - Boolean indicating if the user is enrolled in the course
 * @param userProgress - Object mapping lesson IDs to completion status
 * @returns The JSX element representing the course curriculum
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData, CourseLesson } from "@/data/education";
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

/**
 * Course Curriculum Component
 * Main component for displaying course curriculum with progress tracking
 * Calculates and displays curriculum progress, next lesson, and handles lesson interactions
 * @param course - The course data object
 * @param isEnrolled - Whether the user is enrolled
 * @param userProgress - User's progress on lessons
 * @returns The rendered curriculum component
 */
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

  /**
   * Handle lesson click events
   * Processes lesson selection and navigation logic
   * Currently logs the lesson click for debugging purposes
   * @param lesson - The lesson object that was clicked
   */
  const handleLessonClick = (lesson: CourseLesson) => {
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
