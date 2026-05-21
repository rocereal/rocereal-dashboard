"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { useState } from "react";
import { MarketingReportSection } from "../../(components)/MarketingPerformance";

export default function RenderPage() {
  const defaultDateRange = (): DateTimeRange => {
    const now  = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from, to: now };
  };
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(defaultDateRange);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Raport Marketing"
        subtitle="Trend venituri vs investiție ads și performanță pe canal de marketing."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapoarte Financiare", href: "/finance" },
          { label: "Raport marketing" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <MarketingReportSection dateRange={dateRange} />
    </div>
  );
}
