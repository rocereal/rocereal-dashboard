/**
 * Model Metrics Component
 * This component displays AI model performance metrics
 * It renders section cards with key model data and charts showing latency trends and completion success rates
 * Provides insights into model response times, error rates, and overall performance
 * @returns The JSX element representing the model metrics dashboard
 */
"use client";

import { SampleBarChart } from "@/components/charts/SampleBarChart";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { ChartConfig } from "@/components/ui/charts";
import { modelMetricsData } from "@/data/ai-model-metrics";
import { completionData, latencyData } from "@/data/model-metrics-charts";
import { SectionCards } from "./SectionCards";

const latencyConfig: ChartConfig = {
  latency: {
    label: "Average Latency (ms)",
    color: "var(--chart-1)",
  },
};

const completionConfig: ChartConfig = {
  successful: {
    label: "Successful Completions",
    color: "var(--chart-1)",
  },
  errors: {
    label: "Errors",
    color: "var(--chart-2)",
  },
};

export function ModelMetrics() {
  return (
    // Main container for model metrics
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={modelMetricsData} />
      {/* Grid container for model charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Average Latency Line Chart */}
        <SampleLineChart
          data={latencyData}
          title="Average Latency Over Time"
          description="Model response time performance metrics"
          config={latencyConfig}
          dataKeys={["latency"]}
          showTimeRange={true}
        />

        {/* Successful Completions vs Errors Stacked Bar Chart */}
        <SampleBarChart
          data={completionData}
          title="Completion Success Rate"
          description="Successful completions vs errors per day"
          config={completionConfig}
          dataKeys={["successful", "errors"]}
        />
      </div>
    </div>
  );
}
