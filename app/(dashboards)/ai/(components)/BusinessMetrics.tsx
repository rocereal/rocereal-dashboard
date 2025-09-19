"use client";

import { BusinessCustomersTable } from "@/components/tables/BusinessCustomersTable";
import { businessMetricsData } from "@/data/ai-business-metrics";
import { SectionCards } from "./SectionCards";

export function BusinessMetrics() {
  return (
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={businessMetricsData} />

      <BusinessCustomersTable />
    </div>
  );
}
