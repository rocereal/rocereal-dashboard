"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecommendedCourse } from "@/data/education";
import { Star, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface RecommendedCoursesProps {
  courses: RecommendedCourse[];
  className?: string;
}

export function RecommendedCourses({
  courses,
  className,
}: RecommendedCoursesProps) {
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="group relative overflow-hidden border bg-card/50 shadow-xs backdrop-blur-sm transition-all hover:shadow-md"
          >
            <div className="relative h-40 w-full">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
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

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-primary">
                  ${course.price}
                </div>
                <Button size="sm" className="h-8 px-3">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Enroll
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
