"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { useState } from "react";
import { EvolutiaVanzarilor } from "./EvolutiaVanzarilor";
import { FinanceMetrics } from "./FinanceMetrics";
import { MarketingPerformance } from "./MarketingPerformance";

export default function RenderPage() {
  const defaultDateRange = (): DateTimeRange => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from, to: now };
  };
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(defaultDateRange);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Rapoarte Financiare"
        subtitle="Monitor revenue, expenses, and investment trends to optimize financial health."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapoarte Financiare" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <EvolutiaVanzarilor dateRange={dateRange} />

      <FinanceMetrics dateRange={dateRange} />

      <MarketingPerformance dateRange={dateRange} />
    </div>
  );
}
