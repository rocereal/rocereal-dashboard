"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RecommendedCourse } from "@/data/education";
import { cn } from "@/lib/utils";
import { Book, Clock, Search, ShoppingCart, Star, User } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface RecommendedCoursesProps {
  courses: RecommendedCourse[];
  className?: string;
}

export function RecommendedCourses({
  courses,
  className,
}: RecommendedCoursesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    if (!searchTerm) return courses;

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.authors.some((author) =>
          author.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [courses, searchTerm]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Recommended Courses
        </h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group relative overflow-hidden border bg-card/50 shadow-xs backdrop-blur-sm transition-all hover:shadow-md"
          >
            <div className="relative overflow-hidden aspect-video w-full flex flex-col">
              <ImageComponentOptimized
                unoptimized={true}
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1 text-white">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium line-clamp-2 leading-tight">
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">{course.authors.join(", ")}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 justify-between align-middle">
                <div className="flex flex-col items-start justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{course.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{course.courses}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-primary">
                  ${course.price}
                </div>
                <Link
                  shallow={true}
                  href="/apps/lms/[courseId]"
                  as={`/apps/lms/${course?.id}`}
                  passHref
                  style={{ textDecoration: "none" }}
                  className="cursor-pointer"
                >
                  <Button className="h-8 px-3 rounded-sm">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Enroll
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
