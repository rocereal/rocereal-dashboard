"use client";

import { SampleBarChart } from "@/components/charts/SampleBarChart";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { ChartConfig } from "@/components/ui/charts";
import { userMetrics as aiUserMetrics } from "@/data/ai-user-metrics";
import { chartData } from "@/data/charts";
import { salesData } from "@/data/sales-data";
import { SectionCards } from "./SectionCards";

const salesConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
};

/**
 * User Metrics Component
 * This component displays user-related AI metrics and analytics
 * It renders section cards with user metrics, traffic analytics bar chart, and financial overview charts
 * Provides insights into user behavior, website traffic, and revenue trends
 * @returns The JSX element representing the user metrics dashboard
 */
export function UserMetrics() {
  return (
    // Main container for user metrics
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={aiUserMetrics} />
      <SampleBarChart
        data={chartData}
        title="Website Traffic Analytics"
        description="Desktop and mobile visitor statistics"
        dataKeys={["desktop", "mobile"]}
        dateKey="date"
      />
      {/* Grid container for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SampleLineChart />

        <SampleLineChart
          data={salesData}
          title="Financial Overview"
          description="Revenue vs expenses over time"
          config={salesConfig}
          dataKeys={["revenue", "expenses"]}
          dateKey="date"
          showTimeRange={false}
        />
      </div>
    </div>
  );
}
