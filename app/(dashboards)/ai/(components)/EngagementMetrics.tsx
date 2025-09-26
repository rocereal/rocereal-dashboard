/**
 * Engagement Metrics Component
 * This component displays user engagement metrics for AI services
 * It renders section cards with key engagement data and various charts including pie, radar, word cloud, and funnel charts
 * Provides insights into feature usage, user journeys, query topics, and engagement patterns
 * @returns The JSX element representing the engagement metrics dashboard
 */
"use client";

import { FunnelChart } from "@/components/charts/FunnelChart";
import { PieChart } from "@/components/charts/PieChart";
import { RadarChart } from "@/components/charts/RadarChart";
import { WordCloud } from "@/components/charts/WordCloud";
import { engagementMetricsData } from "@/data/ai-engagement-metrics";
import {
  featuresData,
  queryTopicsData,
  userJourneyData,
} from "@/data/engagement-metrics-charts";
import { SectionCards } from "./SectionCards";

export function EngagementMetrics() {
  return (
    // Main container for engagement metrics
    <div className="flex flex-col space-y-4">
      <SectionCards metrics={engagementMetricsData} />
      {/* Grid container for first row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Most Used AI Features - Pie Chart */}
        <PieChart
          data={featuresData}
          title="Most Used AI Features"
          description="Chat, code generation, summarization, and other features"
          dataKey="usage"
          nameKey="feature"
        />

        {/* User Engagement Radar Chart */}
        <RadarChart
          data={[
            { name: "Daily Users", value: 85 },
            { name: "Weekly Users", value: 72 },
            { name: "Monthly Users", value: 65 },
            { name: "Retention Rate", value: 78 },
            { name: "Satisfaction", value: 82 },
            { name: "Feature Usage", value: 90 },
          ]}
          title="User Engagement Overview"
          description="Multi-dimensional view of user engagement metrics"
          dataKey="value"
          nameKey="name"
        />
      </div>
      {/* Grid container for second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Popular Query Topics - Word Cloud */}
        <WordCloud
          data={queryTopicsData}
          title="Popular Query Topics"
          description="Most frequently asked topics and themes"
        />

        {/* User Journey Funnel */}
        <FunnelChart
          data={userJourneyData}
          title="User Journey Funnel"
          description="Conversion from signup to repeat usage"
        />
      </div>
    </div>
  );
}
