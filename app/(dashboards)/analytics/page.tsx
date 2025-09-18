import { DynamicCard } from "@/components/ui/dynamic-card";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { analyticsMetrics } from "@/data/analytics";
import { Download, Settings } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader
        title="Analytics"
        subtitle="Monitor your business performance and key metrics"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Analytics" },
        ]}
        primaryAction={{
          label: "Export Data",
          icon: <Download className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
        }}
      />

      {/* Dynamic Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsMetrics.slice(0, 4).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {analyticsMetrics.slice(4).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} size="sm" />
        ))}
      </div>

      {/* Full Grid of All Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {analyticsMetrics.map((metric) => (
          <DynamicCard key={metric.id} metric={metric} size="lg" />
        ))}
      </div>
    </>
  );
}
