"use client";

import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { OrdersTable } from "@/components/ecommerce/orders-table";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import {
  ecommerceMetrics,
  revenueData,
  conversionFunnelData,
} from "@/data/ecommerce";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { SectionCards } from "./SectionCards";

const revenueConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
};

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="E-commerce Performance Dashboard"
        subtitle="Monitor sales, customer behavior, and product performance to drive growth."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "E-commerce Performance Dashboard" },
        ]}
        primaryAction={{
          label: "Add Product",
          icon: <TrendingUp className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SectionCards metrics={ecommerceMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Chart - Takes 2 columns */}
        <div className="lg:col-span-2 h-full">
          <SampleLineChart
            data={revenueData}
            title="Revenue Growth"
            description="Track daily revenue performance over time"
            config={revenueConfig}
            dataKeys={["revenue"]}
            dateKey="date"
            showTimeRange={true}
            showCoinSelector={false}
            className="h-full"
          />
        </div>

        {/* Coin Converter - Takes 1 column */}
        <div className="lg:col-span-1 h-full">
          <FunnelChart
            data={conversionFunnelData}
            title="Conversion Funnel"
            description="Track user journey from visitor to purchase"
            className="h-full"
          />
        </div>
      </div>

      <OrdersTable />
    </div>
  );
}
