"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "@/data/education";
import { FileText } from "lucide-react";

interface CourseOverviewProps {
  course: CourseData;
}

export function CourseOverview({ course }: CourseOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Course Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {course.description}
        </p>

        {/* Skills You'll Learn */}
        {course.skills && course.skills.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Skills you&apos;ll learn:</h4>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Prerequisites:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {course.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
