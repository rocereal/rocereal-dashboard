"use client";

import { PieChart } from "@/components/charts/PieChart";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { financeCharts, financeMetrics, profitLossData } from "@/data/finance";
import { useState } from "react";
import { SectionCards } from "@/app/(dashboards)/finance/(components)/SectionCards";
import { TransactionsTable } from "@/app/(dashboards)/finance/(components)/TransactionsTable";

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
        title="Smartbill"
        subtitle="Rapoarte și facturi din SmartBill — venituri, cheltuieli și tranzacții."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapoarte Financiare", href: "/finance" },
          { label: "Smartbill" },
        ]}
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
