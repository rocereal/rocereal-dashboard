"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { SectionCards } from "./SectionCards";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { CRMCustomerTable } from "@/components/tables/crm-customer-table";
import { crmMetrics } from "@/data/crm-metrics";
import { crmSalesFunnelData } from "@/data/crm-sales-funnel";
import { crmCustomers } from "@/data/crm-customers";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { ChartConfig } from "@/components/ui/charts";

const salesFunnelConfig: ChartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-1)",
  },
  opportunities: {
    label: "Opportunities",
    color: "var(--chart-2)",
  },
  negotiations: {
    label: "Negotiations",
    color: "var(--chart-3)",
  },
  closedWon: {
    label: "Closed Won",
    color: "var(--chart-4)",
  },
  closedLost: {
    label: "Closed Lost",
    color: "var(--chart-5)",
  },
};

const dealsConfig: ChartConfig = {
  dealsCreated: {
    label: "Deals Created",
    color: "var(--chart-1)",
  },
  dealsClosed: {
    label: "Deals Closed",
    color: "var(--chart-2)",
  },
};

export default function RenderPage() {
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SampleLineChart
          data={crmSalesFunnelData}
          title="Sales Funnel Performance"
          description="Leads → Opportunities → Negotiations → Closed Won/Lost"
          config={salesFunnelConfig}
          dataKeys={[
            "leads",
            "opportunities",
            "negotiations",
            "closedWon",
            "closedLost",
          ]}
          dateKey="date"
          showTimeRange={true}
        />

        <SampleLineChart
          data={crmSalesFunnelData}
          title="Deals Created vs Closed"
          description="Track deal velocity and pipeline health over time"
          config={dealsConfig}
          dataKeys={["dealsCreated", "dealsClosed"]}
          dateKey="date"
          showTimeRange={true}
        />
      </div>

      <CRMCustomerTable data={crmCustomers} />
    </div>
  );
}
