"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { businessMetricsData } from "@/data/ai-business-metrics";
import { SectionCards } from "./SectionCards";
import { BusinessCustomersTable } from "@/components/tables/BusinessCustomersTable";

export function BusinessMetrics() {
  return (
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={businessMetricsData} />

      <BusinessCustomersTable />
    </div>
  );
}
