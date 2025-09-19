"use client";

import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { PieChart } from "@/components/charts/PieChart";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { OrdersTable } from "@/components/ecommerce/orders-table";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { financeMetrics, profitLossData, financeCharts } from "@/data/finance";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { SectionCards } from "./SectionCards";
import { TransactionsTable } from "./TransactionsTable";

const profitLossConfig: ChartConfig = {
  profit: {
    label: "Profit/Loss",
    color: "var(--chart-1)",
  },
};

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Financial Performance Dashboard"
        subtitle="Monitor revenue, expenses, and investment trends to optimize financial health."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Financial Performance Dashboard" },
        ]}
        primaryAction={{
          label: "Reports",
          icon: <TrendingUp className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SectionCards metrics={financeMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <SampleLineChart
            data={profitLossData}
            title="Profit & Loss Over Time"
            description="Track daily profit and loss performance"
            config={profitLossConfig}
            dataKeys={["profit"]}
            dateKey="date"
            showTimeRange={true}
            showCoinSelector={false}
            className="h-full"
          />
        </div>

        <div className="h-full">
          <PieChart
            data={financeCharts.assetAllocation}
            title="Asset Allocation"
            description="Portfolio distribution by asset type"
            dataKey="value"
            nameKey="name"
            className="h-full"
          />
        </div>
      </div>

      <TransactionsTable />
    </div>
  );
}
