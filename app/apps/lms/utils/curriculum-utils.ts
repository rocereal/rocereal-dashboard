import { CourseData, CourseLesson } from "@/data/education";

export interface CurriculumSection {
  type: string;
  lessons: CourseLesson[];
  completedCount: number;
  totalCount: number;
}

export interface CurriculumProgress {
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  sections: CurriculumSection[];
}

/**
 * Group lessons by type for better organization
 */
export function groupLessonsByType(
  lessons: CourseLesson[]
): CurriculumSection[] {
  const grouped = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.type]) {
      acc[lesson.type] = [];
    }
    acc[lesson.type].push(lesson);
    return acc;
  }, {} as Record<string, CourseLesson[]>);

  return Object.entries(grouped).map(([type, lessons]) => ({
    type,
    lessons,
    completedCount: lessons.filter((lesson) => lesson.completed).length,
    totalCount: lessons.length,
  }));
}

/**
 * Calculate curriculum progress
 */
export function calculateCurriculumProgress(
  curriculum: CourseLesson[],
  userProgress: { [lessonId: string]: boolean } = {}
): CurriculumProgress {
  const totalLessons = curriculum.length;
  const completedLessons = curriculum.filter(
    (lesson) => userProgress[lesson.id] || lesson.completed
  ).length;

  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const sections = groupLessonsByType(curriculum);

  return {
    completedLessons,
    totalLessons,
    progressPercentage,
    sections,
  };
}

/**
 * Get next lesson to continue from
 */
export function getNextLesson(
  curriculum: CourseLesson[],
  userProgress: { [lessonId: string]: boolean } = {}
): CourseLesson | null {
  for (const lesson of curriculum) {
    if (!userProgress[lesson.id] && !lesson.completed) {
      return lesson;
    }
  }
  return null;
}

/**
 * Get lessons for preview (first N lessons)
 */
export function getCurriculumPreview(
  curriculum: CourseLesson[],
  previewCount: number = 5
): CourseLesson[] {
  return curriculum.slice(0, previewCount);
}

/**
 * Format lesson duration for display
 */
export function formatLessonDuration(duration: string): string {
  // Convert "1h 30min" to "1h 30m" or keep as is
  return duration.replace("min", "m");
}

/**
 * Get lesson type display name
 */
export function getLessonTypeDisplayName(type: string): string {
  const typeMap: { [key: string]: string } = {
    video: "Video Lecture",
    quiz: "Interactive Quiz",
    assignment: "Hands-on Assignment",
    reading: "Reading Material",
  };
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Check if lesson is accessible to user
 */
export function isLessonAccessible(
  lessonIndex: number,
  isEnrolled: boolean,
  previewCount: number = 3
): boolean {
  if (isEnrolled) return true;
  return lessonIndex < previewCount;
}

/**
 * Get curriculum completion status
 */
export function getCurriculumStatus(
  progress: CurriculumProgress
): "not-started" | "in-progress" | "completed" {
  if (progress.completedLessons === 0) return "not-started";
  if (progress.completedLessons === progress.totalLessons) return "completed";
  return "in-progress";
}

/**
 * Get readable progress text
 */
export function getProgressText(progress: CurriculumProgress): string {
  const { completedLessons, totalLessons, progressPercentage } = progress;

  if (completedLessons === 0) {
    return `Ready to start • ${totalLessons} lessons`;
  }

  if (completedLessons === totalLessons) {
    return `Completed • ${Math.round(progressPercentage)}%`;
  }

  return `${completedLessons} of ${totalLessons} completed • ${Math.round(
    progressPercentage
  )}%`;
}
