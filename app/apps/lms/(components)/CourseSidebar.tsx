"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CourseData } from "@/data/education";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Star,
  Tag,
  User,
} from "lucide-react";
import { EnrollmentPreview } from "./EnrollmentPreview";

interface CourseSidebarProps {
  course: CourseData;
  isEnrolled?: boolean;
  userProgress?: { [lessonId: string]: boolean };
}

export function CourseSidebar({
  course,
  isEnrolled = false,
  userProgress = {},
}: CourseSidebarProps) {
  const completedLessons = Object.values(userProgress).filter(Boolean).length;
  const totalLessons = course.curriculum?.length || 0;
  const userProgressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Course Stats or User Progress */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEnrolled ? "Your Progress" : "Course Statistics"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {isEnrolled ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Lessons Completed
                  </span>
                  <span className="font-medium">
                    {completedLessons} of {totalLessons}
                  </span>
                </div>
                <Progress value={userProgressPercentage} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="font-medium">
                    {Math.round(userProgressPercentage)}%
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate
                  </span>
                  <span className="font-medium">{course.completionRate}%</span>
                </div>
                <Progress value={course.completionRate} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Students Enrolled
                  </span>
                  <span className="font-medium">{course.enrolled}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Average Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.avgRating}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {course.instructor && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="font-medium">{course.level}</p>
              </div>
            </div>

            {course.language && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium">{course.language}</p>
                </div>
              </div>
            )}

            {course.lastUpdated && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{course.lastUpdated}</p>
                </div>
              </div>
            )}

            {course.price && !isEnrolled && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-lg">
                    {course.currency} {course.price}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {isEnrolled ? (
            <Button className="w-full" size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          ) : (
            <EnrollmentPreview
              course={course}
              trigger={
                <Button className="w-full" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      {course.tags && course.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
