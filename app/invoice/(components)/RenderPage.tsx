"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Invoice, invoicesData } from "@/data/invoices";
import {
  FileText,
  Receipt,
  Plus,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { InvoicesTable } from "./InvoicesTable";
import { SectionCards } from "./SectionCards";

export default function RenderPage() {
  const [invoices, setInvoices] = useState(invoicesData);

  const handleView = (invoice: Invoice) => {
    console.log("View invoice:", invoice);
    // Navigate to invoice detail page
    window.open(`/invoice/${invoice.id}`, "_blank");
  };

  const handlePrint = (invoice: Invoice) => {
    console.log("Print invoice:", invoice);
    // Open invoice in new tab for printing
    const printWindow = window.open(`/invoice/${invoice.id}`, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDelete = (invoice: Invoice) => {
    console.log("Delete invoice:", invoice);
    // Implement delete functionality with confirmation
    if (
      confirm(`Are you sure you want to delete invoice "${invoice.number}"?`)
    ) {
      setInvoices(invoices.filter((i) => i.id !== invoice.id));
    }
  };

  const handleAddInvoice = () => {
    window.location.href = "/invoice/add-invoice";
  };

  // Create metrics for SectionCards
  const invoiceMetrics = [
    {
      id: "total-invoices",
      title: "Total Invoices",
      value: invoices.length,
      change: "+3 this month",
      changeType: "positive" as const,
      icon: Receipt,
      description: "Total number of invoices created",
    },
    {
      id: "total-revenue",
      title: "Total Revenue",
      value: `$${invoices
        .reduce((sum, inv) => sum + inv.total, 0)
        .toLocaleString()}`,
      change: "+12% this month",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Total revenue from all invoices",
    },
    {
      id: "pending-payments",
      title: "Pending Payments",
      value: invoices.filter((i) => i.status === "Unpaid").length,
      change: "+2 this week",
      changeType: "neutral" as const,
      icon: Clock,
      description: "Invoices awaiting payment",
    },
    {
      id: "overdue-invoices",
      title: "Overdue Invoices",
      value: invoices.filter((i) => i.status === "Overdue").length,
      change: "-1 this week",
      changeType: "positive" as const,
      icon: AlertTriangle,
      description: "Invoices past due date",
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Invoice Management"
        subtitle="Manage your invoices, track payments, and generate reports"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Invoice" }]}
        primaryAction={{
          label: "Create Invoice",
          icon: <Plus className="h-4 w-4" />,
          onClick: handleAddInvoice,
        }}
        secondaryAction={{
          label: "Export Report",
          icon: <FileText className="h-4 w-4" />,
        }}
      />

      {/* Invoice Stats Cards */}
      <SectionCards metrics={invoiceMetrics} />

      {/* Invoices Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invoice List</h3>
          <InvoicesTable
            invoices={invoices}
            onView={handleView}
            onPrint={handlePrint}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
