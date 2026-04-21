"use client";

import { FunnelChart } from "@/components/charts/FunnelChart";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import {
  conversionFunnelData,
  ecommerceMetrics,
  Product,
  productsData,
  revenueData,
} from "@/data/ecommerce";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { SectionCards } from "@/app/(dashboards)/ecommerce/(components)/SectionCards";
import { ProductsTable } from "@/app/(dashboards)/ecommerce/(components)/ProductsTable";

const revenueConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
};

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();
  const [products, setProducts] = useState(productsData);

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(products.filter((p) => p.id !== product.id));
    }
  };

  const handleView = (product: Product) => {
    console.log("View product:", product);
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Magazine Online"
        subtitle="Monitor sales, customer behavior, and product performance to drive growth."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Canale Vanzare", href: "/ecommerce" },
          { label: "Magazine Online" },
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
        <div className="lg:col-span-1 h-full">
          <FunnelChart
            data={conversionFunnelData}
            title="Conversion Funnel"
            description="Track user journey from visitor to purchase"
            className="h-full"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Catalog</h3>
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>
    </div>
  );
}
