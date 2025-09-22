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
  const accessible = true; // Changed from: isLessonAccessible(index, isEnrolled);
  const displayType = getLessonTypeDisplayName(lesson.type);
  const formattedDuration = formatLessonDuration(lesson.duration);

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

  const getStatusColor = () => {
    if (showAsCompleted) return "bg-green-500 text-white";
    if (isNextLesson && isEnrolled) return "bg-blue-500 text-white";
    if (!isEnrolled) return "bg-muted text-muted-foreground"; // Changed condition
    return "bg-primary text-primary-foreground";
  };

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
