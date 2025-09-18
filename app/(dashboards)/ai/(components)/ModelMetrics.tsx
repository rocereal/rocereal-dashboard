"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modelMetricsData } from "@/data/ai-model-metrics";
import { latencyData, completionData } from "@/data/model-metrics-charts";
import { SectionCards } from "./SectionCards";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { SampleBarChart } from "@/components/charts/SampleBarChart";
import { ChartConfig } from "@/components/ui/charts";

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
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={modelMetricsData} />

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
