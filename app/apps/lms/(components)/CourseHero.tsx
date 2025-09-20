import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseData } from "@/data/education";
import { Award, BookOpen, Clock, Play, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EnrollmentPreview } from "./EnrollmentPreview";

interface CourseHeroProps {
  course: CourseData;
  isEnrolled?: boolean;
  progress?: number;
}

export function CourseHero({
  course,
  isEnrolled = false,
  progress = 0,
}: CourseHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {course.level}
            </Badge>
            {course.certificate && (
              <Badge variant="outline" className="text-sm">
                <Award className="h-3 w-3 mr-1" />
                Certificate
              </Badge>
            )}
            {isEnrolled && (
              <Badge variant="default" className="text-sm bg-green-600">
                Enrolled
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-lg text-muted-foreground">
              {course.description}
            </p>
          </div>

          {isEnrolled && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your Progress</span>
                <span>{progress}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.avgRating}</span>
              <span className="text-muted-foreground">
                ({course.reviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{course.enrolled} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isEnrolled ? (
              <>
                <Button size="lg" className="px-8">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Link href={`/apps/lms/${course.courseId}/curriculum`}>
                  <Button variant="outline" size="lg">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Curriculum
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <EnrollmentPreview course={course} />
                <Link href={`/apps/lms/${course.courseId}/curriculum`}>
                  <Button variant="outline" size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Preview Curriculum
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          {isEnrolled && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-green-600 text-white">
                Continue Your Journey
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
