"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/data/education";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Users,
  Award,
  GraduationCap,
  Globe,
} from "lucide-react";
import { CurriculumLesson } from "./CurriculumLesson";
import { getCurriculumPreview } from "../utils/curriculum-utils";

interface EnrollmentPreviewProps {
  course: CourseData;
  trigger?: React.ReactNode;
}

export function EnrollmentPreview({ course, trigger }: EnrollmentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button size="lg" className="px-8">
      <BookOpen className="h-4 w-4 mr-2" />
      Enroll Now
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {course.title} - Course Preview
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Course Overview */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-medium">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="font-medium">{course.enrolled}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium">{course.avgRating}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                {course.certificate && (
                  <Badge variant="outline">
                    <Award className="h-3 w-3 mr-1" />
                    Certificate Included
                  </Badge>
                )}
                {course.language && (
                  <Badge variant="outline">
                    <Globe className="h-3 w-3 mr-1" />
                    {course.language}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          {course.skills && course.skills.length > 0 && (
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>What You&apos;ll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {prereq}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Curriculum Preview */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Curriculum Preview</span>
                <Badge variant="secondary">{course.courses}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Show first 5 lessons as preview */}
                {getCurriculumPreview(course.curriculum || [], 5).map(
                  (lesson, index) => (
                    <CurriculumLesson
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      isEnrolled={false}
                      isCompleted={false}
                      showPreviewBadge={true}
                      className="bg-muted/30"
                    />
                  )
                )}

                {course.curriculum && course.curriculum.length > 5 && (
                  <div className="text-center py-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      +{course.curriculum.length - 5} more lessons included
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Full curriculum available after enrollment
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Enrollment */}
          <Card className="rounded-none border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ${course.price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    One-time payment • Lifetime access
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    size="lg"
                    className="px-8"
                    onClick={() => {
                      // Handle enrollment logic here
                      console.log("Enrolling in course:", course.courseId);
                      setIsOpen(false);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Enroll Now - ${course.price}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Maybe Later
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  ✓ Full lifetime access to course materials
                  <br />
                  ✓ Certificate of completion
                  <br />
                  ✓ Mobile and desktop access
                  <br />✓ Community support
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
