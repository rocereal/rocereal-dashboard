import { notFound } from "next/navigation";
import { invoiceDetailsData, InvoiceDetail } from "@/data/invoices";
import {
  InvoiceHeader,
  InvoiceDetails,
  InvoiceAddresses,
  InvoiceItemsTable,
  InvoiceTotals,
  InvoiceNotes,
  InvoicePaymentMethods,
} from "@/components/invoice";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassicInvoice({ params }: PageProps) {
  const { id } = await params;
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
    <div className="max-w-4xl mx-auto p-6 bg-white print:p-8">
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
            <div className="border-b  w-48 mb-2"></div>
            <p className="text-sm text-gray-700">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
