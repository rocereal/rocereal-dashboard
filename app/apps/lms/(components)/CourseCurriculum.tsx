import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseData } from "@/data/education";
import {
  BookOpen,
  CheckCircle,
  FileText,
  Play,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

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

  const completedLessons = Object.values(userProgress).filter(Boolean).length;
  const totalLessons = course.curriculum.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Curriculum
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEnrolled && (
              <div className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} completed
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
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lessonsToShow.map((lesson, index) => {
            const isCompleted = userProgress[lesson.id] || lesson.completed;
            const isLocked = !isEnrolled && index >= 3;

            return (
              <div
                key={lesson.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isLocked
                    ? "opacity-60 cursor-not-allowed"
                    : isEnrolled
                    ? "hover:bg-muted/50 cursor-pointer"
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : isLocked
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isLocked ? (
                      "🔒"
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className={isLocked ? "blur-sm" : ""}>
                    <h4 className="font-medium">{lesson.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {lesson.type === "video" && <Play className="h-3 w-3" />}
                      {lesson.type === "quiz" && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {lesson.type === "assignment" && (
                        <FileText className="h-3 w-3" />
                      )}
                      {lesson.type === "reading" && (
                        <BookOpen className="h-3 w-3" />
                      )}
                      <span className="capitalize">{lesson.type}</span>
                      <span>•</span>
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isLocked && (
                  <div className="text-xs text-muted-foreground">
                    Enroll to unlock
                  </div>
                )}
              </div>
            );
          })}

          {!isEnrolled && course.curriculum.length > 3 && (
            <div className="text-center py-4">
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
