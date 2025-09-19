import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData, EducationMetric } from "@/data/education";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface SectionCardsProps {
  metrics?: EducationMetric[];
  courses?: CourseData[];
  className?: string;
}

export function SectionCards({
  metrics,
  courses,
  className,
}: SectionCardsProps) {
  // If courses are provided, show course cards
  if (courses && courses.length > 0) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
          className
        )}
      >
        {courses.map((course) => {
          const IconComponent = course.icon;

          return (
            <Card
              key={course.id}
              className="relative overflow-hidden border bg-card/50 shadow-xs backdrop-blur-sm"
            >
              <div className="relative overflow-hidden aspect-video w-full flex flex-col">
                <ImageComponentOptimized
                  unoptimized={true}
                  src={course.image}
                  alt={course.title}
                  placeholder="blur"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-2 right-2">
                  {IconComponent && (
                    <IconComponent className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Enrolled</span>
                    </div>
                    <span className="font-medium">{course.enrolled}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Completion
                        </span>
                      </div>
                      <span className="font-medium">
                        {course.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Rating</span>
                    </div>
                    <span className="font-medium">{course.avgRating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Otherwise show metrics cards
  const displayMetrics = metrics || [];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {displayMetrics.map((metric) => {
        const IconComponent = metric.icon;
        const isPositive = metric.changeType === "positive";

        return (
          <Card
            key={metric.id}
            className="relative overflow-hidden border bg-card/50 shadow-xs backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {IconComponent && (
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {metric.value}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs flex items-center gap-1",
                    isPositive
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
