/**
 * LMS Utilities Module
 * Provides utility functions for course management and slug generation
 * Includes functions for creating course slugs, finding courses by slug, and retrieving all course slugs
 * Used throughout the LMS application for course-related operations
 */
import { coursesData } from "@/data/education";

/**
 * Convert course title to a readable slug
 * Transforms course titles into URL-friendly slugs by converting to lowercase,
 * removing special characters, replacing spaces with hyphens, and normalizing multiple hyphens
 * @param title - The course title to convert to a slug
 * @returns The URL-friendly slug string
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
 * Searches for courses by slug, first checking exact courseId matches,
 * then falling back to title-based slug matching for flexible course discovery
 * @param slug - The slug to search for (either courseId or title-based slug)
 * @returns The found course object or undefined if not found
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
 * Generates an array of all course IDs for use in static site generation
 * and dynamic route creation in Next.js applications
 * @returns Array of course ID strings for static generation
 */
export function getAllCourseSlugs(): string[] {
  return coursesData.map((course) => course.courseId);
}
