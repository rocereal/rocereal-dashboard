"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userMetrics as aiUserMetrics } from "@/data/ai-user-metrics";
import { SectionCards } from "./SectionCards";
import { SampleBarChart } from "@/components/charts/BarChart";

export function UserMetrics() {
  return (
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={aiUserMetrics} />
      <SampleBarChart />
    </div>
  );
}
