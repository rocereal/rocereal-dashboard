"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import {
  InvoiceAddresses,
  InvoiceDetails,
  InvoiceHeader,
  InvoiceItemsTable,
  InvoiceNotes,
  InvoicePaymentMethods,
  InvoiceTotals,
} from "@/components/invoice";
import { Button } from "@/components/ui/button";
import { InvoiceDetail, invoiceDetailsData } from "@/data/invoices";
import { Download, Edit, Eye, Share, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

interface RenderPageProps {
  id: string;
}

export default function RenderPage({ id }: RenderPageProps) {
  const data: InvoiceDetail | undefined = invoiceDetailsData[id];

  if (!data) {
    notFound();
  }

  const {
    company,
    client,
    project,
    invoice,
    items,
    totals,
    notes,
    paymentMethod,
    metadata,
  } = data;

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardHeader
          title={`Invoice ${invoice.number}`}
          subtitle={`Invoice details for ${client.name}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Invoices", href: "/invoice" },
            { label: invoice.number },
          ]}
        />
        <div className="flex items-center flex-wrap gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white  print:max-w-none print:p-8">
        <InvoiceHeader company={company} invoice={invoice} />

        <InvoiceDetails project={project} invoice={invoice} />

        <InvoiceAddresses company={company} client={client} />

        <InvoiceItemsTable items={items} />

        <InvoiceTotals totals={totals} />

        <InvoiceNotes notes={notes} />

        <InvoicePaymentMethods paymentMethod={paymentMethod} />

        {/* Footer / Signature */}
        <div className="pt-6">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-4">
                This invoice was generated on{" "}
                {new Date(metadata.createdAt).toLocaleDateString()} and is valid
                for 30 days.
              </p>
            </div>
            <div className="text-right">
              <div className="border-b  border-gray-200 w-48 mb-2"></div>
              <p className="text-sm text-gray-700">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
