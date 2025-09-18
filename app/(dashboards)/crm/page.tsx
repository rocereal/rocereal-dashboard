"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { SectionCards } from "./(components)/SectionCards";
import { crmMetrics } from "@/data/crm-metrics";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";

export default function CrmPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-4">
      <DashboardHeader
        title="Customer Relationship Dashboard"
        subtitle="Track pipeline health, customer engagement, and revenue performance in real time."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Customer Relationship Dashboard" },
        ]}
        primaryAction={{
          label: "Add User",
          icon: <UserPlus className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SectionCards metrics={crmMetrics} />
    </div>
  );
}
