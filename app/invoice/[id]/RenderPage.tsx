"use client";

import { notFound } from "next/navigation";
import { invoiceDetailsData, InvoiceDetail } from "@/data/invoices";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { ArrowLeft } from "lucide-react";
import {
  InvoiceHeader,
  InvoiceDetails,
  InvoiceAddresses,
  InvoiceItemsTable,
  InvoiceTotals,
  InvoiceNotes,
  InvoicePaymentMethods,
} from "@/components/invoice";
import { Button } from "@/components/ui/button";
import {
  Download,
  Edit,
  Eye,
  FileText,
  Share,
  Star,
  Trash2,
} from "lucide-react";

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

  const handleBack = () => {
    window.history.back();
  };

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
              <div className="border-b w-48 mb-2"></div>
              <p className="text-sm text-gray-700">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
