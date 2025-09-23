/**
 * Curriculum Lesson Component
 * Displays individual lesson items in the course curriculum with status indicators and actions
 * Shows lesson number, title, type, duration, and completion status with appropriate styling
 * Handles different states for enrolled vs non-enrolled users and various lesson statuses
 * @param lesson - The lesson data object containing lesson information
 * @param index - The lesson's position in the curriculum (0-based)
 * @param isEnrolled - Whether the user is enrolled in the course
 * @param isCompleted - Whether the lesson is completed
 * @param isNextLesson - Whether this is the next lesson to be taken
 * @param showPreviewBadge - Whether to show preview badge
 * @param onLessonClick - Callback function when lesson is clicked
 * @param className - Additional CSS classes
 * @returns The JSX element representing a curriculum lesson
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseLesson } from "@/data/education";
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Trophy,
} from "lucide-react";
import {
  formatLessonDuration,
  getLessonTypeDisplayName,
} from "../utils/curriculum-utils";

interface CurriculumLessonProps {
  lesson: CourseLesson;
  index: number;
  isEnrolled: boolean;
  isCompleted: boolean;
  isNextLesson?: boolean;
  showPreviewBadge?: boolean;
  onLessonClick?: (lesson: CourseLesson) => void;
  className?: string;
}

/**
 * Curriculum Lesson Component
 * Main component for displaying individual curriculum lessons with interactive features
 * Renders lesson details, status indicators, and action buttons based on enrollment and progress
 * @param lesson - The lesson data object
 * @param index - Lesson index in curriculum
 * @param isEnrolled - User enrollment status
 * @param isCompleted - Lesson completion status
 * @param isNextLesson - Next lesson indicator
 * @param showPreviewBadge - Show preview badge
 * @param onLessonClick - Click handler
 * @param className - CSS classes
 * @returns The rendered lesson component
 */
export function CurriculumLesson({
  lesson,
  index,
  isEnrolled,
  isCompleted,
  isNextLesson = false,
  showPreviewBadge = false,
  onLessonClick,
  className = "",
}: CurriculumLessonProps) {
  // Make all lessons accessible for preview
  const displayType = getLessonTypeDisplayName(lesson.type);
  const formattedDuration = formatLessonDuration(lesson.duration);

  /**
   * Get the appropriate icon for the lesson type
   * Returns different icons based on lesson content type (video, quiz, assignment, reading)
   * @returns The JSX element for the lesson type icon
   */
  const getLessonIcon = () => {
    switch (lesson.type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "quiz":
        return <CheckCircle className="h-4 w-4" />;
      case "assignment":
        return <FileText className="h-4 w-4" />;
      case "reading":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  /**
   * Get the CSS classes for the lesson status indicator
   * Determines color scheme based on completion status, enrollment, and next lesson status
   * @returns CSS class string for the status indicator
   */
  const getStatusColor = () => {
    if (showAsCompleted) return "bg-green-500 text-white";
    if (isNextLesson && isEnrolled) return "bg-blue-500 text-white";
    if (!isEnrolled) return "bg-muted text-muted-foreground"; // Changed condition
    return "bg-primary text-primary-foreground";
  };

  /**
   * Handle lesson click events
   * Calls the onLessonClick callback with the current lesson data
   */
  const handleClick = () => {
    if (onLessonClick) {
      onLessonClick(lesson);
    }
  };

  // For non-enrolled users, don't show completed status
  const showAsCompleted = isEnrolled && isCompleted;

  return (
    <div
      className={`group flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        showAsCompleted
          ? "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-secondary dark:border-secondary dark:hover:bg-secondary cursor-pointer"
          : isNextLesson && isEnrolled
          ? "bg-primary/20 border-primary hover:bg-primary/20 cursor-pointer ring-2 ring-primary/20"
          : "hover:bg-muted/50 cursor-pointer"
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 flex-1 flex-wrap min-w-0">
        {/* Lesson Number/Icon */}
        <div
          className={`flex items-center justify-center w-6 h-6 lg:size-10 rounded-full text-sm font-semibold flex-shrink-0 ${getStatusColor()}`}
        >
          {showAsCompleted ? (
            <CheckCircle className="size-2 lg:size-5" />
          ) : (
            index + 1
          )}
        </div>

        {/* Lesson Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap min-w-0">
              <h4 className="font-semibold w-full text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                {lesson.title}
              </h4>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {getLessonIcon()}
                  {displayType}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formattedDuration}
                </span>

                {showAsCompleted && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 text-xs px-2 py-0"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}

                {isNextLesson && isEnrolled && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-0"
                  >
                    Continue Here
                  </Badge>
                )}

                {showPreviewBadge && isEnrolled && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    Preview
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 ml-0 lg:ml-4">
        <Button
          size="sm"
          variant={
            showAsCompleted
              ? "outline"
              : isNextLesson && isEnrolled
              ? "default"
              : isEnrolled
              ? "ghost"
              : "outline" // Changed from showing locked message
          }
          className="text-xs"
        >
          {showAsCompleted
            ? "Review"
            : isNextLesson && isEnrolled
            ? "Continue"
            : isEnrolled
            ? "Start"
            : "Preview"}
        </Button>
      </div>
    </div>
  );
}
