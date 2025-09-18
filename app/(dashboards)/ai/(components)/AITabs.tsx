"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { SectionCards } from "./SectionCards";
import { TabsContent } from "@/components/ui/tabs";
import { aiTabs } from "@/data/ai";
import { userMetrics as aiUserMetrics } from "@/data/ai-user-metrics";
import { modelMetricsData } from "@/data/ai-model-metrics";
import { engagementMetricsData } from "@/data/ai-engagement-metrics";
import { businessMetricsData } from "@/data/ai-business-metrics";
import { UserMetrics } from "./UserMetrics";
import { ModelMetrics } from "./ModelMetrics";
import { EngagementMetrics } from "./EngagementMetrics";

export function AITabs() {
  return (
    <TabsWithIcons tabs={aiTabs} variant="underline">
      <TabsContent value="user" className="space-y-4 pt-4">
        <UserMetrics />
      </TabsContent>

      <TabsContent value="model" className="space-y-4 pt-4">
        <ModelMetrics />
      </TabsContent>

      <TabsContent value="engage" className="space-y-4 pt-4">
        <EngagementMetrics />
      </TabsContent>

      <TabsContent value="business" className="space-y-4 pt-4">
        <SectionCards metrics={businessMetricsData} />
      </TabsContent>
    </TabsWithIcons>
  );
}
