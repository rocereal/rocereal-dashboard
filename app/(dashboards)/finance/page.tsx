import { DynamicCard } from "@/components/ui/dynamic-card";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { financeMetrics } from "@/data/finance";
import { Plus, FileText } from "lucide-react";

export default function FinancePage() {
  return (
    <>
      <DashboardHeader
        title="Finance"
        subtitle="Track your financial performance and investment portfolio"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Finance" }]}
        primaryAction={{
          label: "Add Transaction",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Generate Report",
          icon: <FileText className="h-4 w-4" />,
        }}
      />

      {/* Dynamic Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financeMetrics.slice(0, 4).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {financeMetrics.slice(4).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} size="lg" />
        ))}
      </div>

      {/* Investment Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {financeMetrics.slice(3, 6).map((metric) => (
          <DynamicCard key={metric.id} metric={metric} size="sm" />
        ))}
      </div>
    </>
  );
}
