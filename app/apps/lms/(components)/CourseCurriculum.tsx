import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "@/data/education";
import { BookOpen, CheckCircle, FileText, Play } from "lucide-react";

interface CourseCurriculumProps {
  course: CourseData;
}

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  if (!course.curriculum || course.curriculum.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Curriculum
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {course.curriculum.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {index + 1}
                </div>
                <div>
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
              {lesson.completed && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
