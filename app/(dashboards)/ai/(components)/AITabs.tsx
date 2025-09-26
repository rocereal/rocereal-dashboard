/**
 * AI Tabs Component
 * This component renders a tabbed interface for displaying various AI metrics
 * It includes tabs for user metrics, model metrics, engagement metrics, and business metrics
 * Each tab content displays the corresponding metrics component
 * @returns The JSX element representing the AI tabs interface
 */
"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { TabsContent } from "@/components/ui/tabs";
import { aiTabs } from "@/data/ai";
import { BusinessMetrics } from "./BusinessMetrics";
import { EngagementMetrics } from "./EngagementMetrics";
import { ModelMetrics } from "./ModelMetrics";
import { UserMetrics } from "./UserMetrics";

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
        <BusinessMetrics />
      </TabsContent>
    </TabsWithIcons>
  );
}
