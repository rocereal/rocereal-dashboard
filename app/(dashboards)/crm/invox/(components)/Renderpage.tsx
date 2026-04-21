"use client";

import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { CRMCustomerTable } from "@/app/(dashboards)/crm/(components)/CrmCustomerTable";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { crmMetrics } from "@/data/crm-metrics";
import { crmSalesFunnelData } from "@/data/crm-sales-funnel";
import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { SectionCards } from "@/app/(dashboards)/crm/(components)/SectionCards";
import { AddContactForm } from "@/app/apps/messenger/(components)/AddContactForm";

const salesFunnelConfig: ChartConfig = {
  leads:         { label: "Leads",         color: "var(--chart-1)" },
  opportunities: { label: "Opportunities", color: "var(--chart-2)" },
  negotiations:  { label: "Negotiations",  color: "var(--chart-3)" },
  closedWon:     { label: "Closed Won",    color: "var(--chart-4)" },
  closedLost:    { label: "Closed Lost",   color: "var(--chart-5)" },
};

const dealsConfig: ChartConfig = {
  dealsCreated: { label: "Deals Created", color: "var(--chart-1)" },
  dealsClosed:  { label: "Deals Closed",  color: "var(--chart-2)" },
};

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [totalCalls, setTotalCalls] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/crm/calls/count")
      .then((r) => r.json())
      .then((data) => setTotalCalls(data.count))
      .catch(() => {});
  }, []);

  const handleAddContact = (contactData: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  }) => {
    console.log("Adding contact:", contactData);
    setIsAddContactOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <DashboardHeader
        title="Invox Dashboard"
        subtitle="Track pipeline health, customer engagement, and revenue performance in real time."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "CRM", href: "/crm" },
          { label: "Invox" },
        ]}
        primaryAction={{
          label: "Add User",
          onClick: () => setIsAddContactOpen(true),
          icon: <UserPlus className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <SectionCards metrics={crmMetrics.map((m) =>
        m.id === "total-customers" && totalCalls !== null
          ? { ...m, value: totalCalls.toLocaleString("ro-RO") }
          : m
      )} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SampleLineChart
          data={crmSalesFunnelData}
          title="Sales Funnel Performance"
          description="Leads → Opportunities → Negotiations → Closed Won/Lost"
          config={salesFunnelConfig}
          dataKeys={["leads", "opportunities", "negotiations", "closedWon", "closedLost"]}
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
      <CRMCustomerTable />
      <AddContactForm
        open={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        onSubmit={handleAddContact}
      />
    </div>
  );
}
