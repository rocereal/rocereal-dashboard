import { coursesData } from "@/data/education";

/**
 * Convert course title to a readable slug
 */
export function createCourseSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Find course by readable slug
 */
export function findCourseBySlug(slug: string) {
  // First try to find by exact courseId match
  let course = coursesData.find((c) => c.courseId === slug);

  // If not found, try to find by title slug
  if (!course) {
    course = coursesData.find((c) => createCourseSlug(c.title) === slug);
  }

  return course;
}

/**
 * Get all course slugs for static generation
 */
export function getAllCourseSlugs(): string[] {
  return coursesData.map((course) => course.courseId);
}
