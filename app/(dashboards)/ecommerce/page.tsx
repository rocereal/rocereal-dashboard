import { DynamicCard } from "@/components/ui/dynamic-card";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { ecommerceMetrics } from "@/data/ecommerce";
import { ShoppingCart, BarChart3 } from "lucide-react";

export default function EcommercePage() {
  return (
    <>
      <DashboardHeader
        title="E-commerce"
        subtitle="Monitor your online store performance and sales metrics"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "E-commerce" },
        ]}
        primaryAction={{
          label: "View Orders",
          icon: <ShoppingCart className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Analytics",
          icon: <BarChart3 className="h-4 w-4" />,
        }}
      />

      {/* Dynamic Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ecommerceMetrics.slice(0, 4).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {ecommerceMetrics.slice(4).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} size="lg" />
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {ecommerceMetrics.slice(2, 5).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} size="sm" />
        ))}
      </div>
    </>
  );
}
