"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { useState } from "react";
import { AiEmployeesSection } from "./AiEmployeesSection";
import { AttributionPanel }   from "./AttributionPanel";
import { SalesTargetWidget }  from "./SalesTargetWidget";
import { ZeroConversionAds }  from "./ZeroConversionAds";
import { NamingAlerts }       from "./NamingAlerts";

export default function RenderPage() {
  const defaultDateRange = (): DateTimeRange => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  };
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(defaultDateRange);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Analiza AI"
        subtitle="7 angajați AI analizează ads, atribuire, copy, CRO, vânzări, stocuri și performanță business."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapoarte Financiare", href: "/finance" },
          { label: "Analiza AI" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SalesTargetWidget dateRange={dateRange} />

      <AttributionPanel dateRange={dateRange} />

      <ZeroConversionAds dateRange={dateRange} />

      <NamingAlerts />

      <AiEmployeesSection dateRange={dateRange} />
    </div>
  );
}
