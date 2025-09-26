"use client";

import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { CRMCustomerTable } from "@/app/(dashboards)/crm/(components)/CrmCustomerTable";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { crmCustomers } from "@/data/crm-customers";
import { crmMetrics } from "@/data/crm-metrics";
import { crmSalesFunnelData } from "@/data/crm-sales-funnel";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { SectionCards } from "./SectionCards";
import { AddContactForm } from "@/app/apps/messenger/(components)/AddContactForm";

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

/**
 * Render Page Component
 * This is the main rendering component for the CRM dashboard page
 * It displays the dashboard header with breadcrumbs and action buttons, followed by CRM metrics, charts, and customer table
 * Provides the overall layout and navigation for the Customer Relationship Management dashboard
 * @returns The JSX element representing the complete CRM dashboard page layout
 */
export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  /**
   * Handle Add Contact
   * This function handles the submission of the add contact form
   * It logs the contact data and closes the form modal
   * In a real application, this would add the contact to the data store
   * @param contactData - Object containing the contact information (name, email, phone, notes)
   */
  const handleAddContact = (contactData: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  }) => {
    console.log("Adding contact:", contactData);
    // Here you would typically add the contact to your data store
    // For now, we'll just log it
    setIsAddContactOpen(false);
  };

  return (
    // Main container for the CRM dashboard layout
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
          onClick: () => setIsAddContactOpen(true),
          icon: <UserPlus className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <SectionCards metrics={crmMetrics} />
      // Grid container for sales funnel charts
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
      <AddContactForm
        open={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        onSubmit={handleAddContact}
      />
    </div>
  );
}
