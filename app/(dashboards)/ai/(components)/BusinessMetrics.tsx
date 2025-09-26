/**
 * Business Metrics Component
 * This component displays business-related AI metrics and customer data
 * It renders section cards with key business metrics and a table of business customers
 * Provides insights into business performance, customer subscriptions, and revenue
 * @returns The JSX element representing the business metrics dashboard
 */
"use client";

import { BusinessCustomersTable } from "@/app/(dashboards)/ai/(components)/BusinessCustomersTable";
import { businessMetricsData } from "@/data/ai-business-metrics";
import { SectionCards } from "./SectionCards";

export function BusinessMetrics() {
  return (
    // Main container for business metrics
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={businessMetricsData} />

      <BusinessCustomersTable />
    </div>
  );
}
