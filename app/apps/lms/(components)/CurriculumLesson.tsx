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
  isLessonAccessible,
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
  const accessible = isLessonAccessible(index, isEnrolled);
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
    if (isCompleted) return "bg-green-500 text-white";
    if (isNextLesson) return "bg-blue-500 text-white";
    if (!accessible) return "bg-muted text-muted-foreground";
    return "bg-primary text-primary-foreground";
  };

  const handleClick = () => {
    if (accessible && onLessonClick) {
      onLessonClick(lesson);
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        accessible
          ? isCompleted
            ? "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-secondary dark:border-secondary dark:hover:bg-secondary cursor-pointer"
            : isNextLesson
            ? "bg-primary/20 border-primary hover:bg-primary/20 cursor-pointer ring-2 ring-primary/20"
            : "hover:bg-muted/50 cursor-pointer"
          : "opacity-60 cursor-not-allowed bg-muted/30"
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Lesson Number/Icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold flex-shrink-0 ${getStatusColor()}`}
        >
          {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
        </div>

        {/* Lesson Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                {lesson.title}
              </h4>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {getLessonIcon()}
                  {displayType}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formattedDuration}
                </span>

                {isCompleted && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 text-xs px-2 py-0"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}

                {isNextLesson && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-0"
                  >
                    Continue Here
                  </Badge>
                )}

                {showPreviewBadge && (
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
      <div className="flex-shrink-0 ml-4">
        {accessible ? (
          <Button
            size="sm"
            variant={
              isCompleted ? "outline" : isNextLesson ? "default" : "ghost"
            }
            className="text-xs"
          >
            {isCompleted ? "Review" : isNextLesson ? "Continue" : "Start"}
          </Button>
        ) : (
          <div className="text-xs text-muted-foreground px-3 py-1">
            🔒 Enroll to unlock
          </div>
        )}
      </div>
    </div>
  );
}
