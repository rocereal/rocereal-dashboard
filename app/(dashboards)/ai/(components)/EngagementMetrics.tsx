"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userMetrics as aiUserMetrics } from "@/data/ai-user-metrics";
import { SectionCards } from "./SectionCards";

export function EngagementMetrics() {
  return (
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={aiUserMetrics} />
      <Card>
        <CardHeader>
          <CardTitle>User Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Comprehensive user metrics including activity patterns, engagement
            levels, and retention trends.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
