import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddInvoiceForm from "./AddInvoiceForm";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Create Invoice",
  "Create a new invoice with all necessary details."
);

export default function AddInvoicePage() {
  return (
    <div className="container mx-auto py-6">
      <AddInvoiceForm />
    </div>
  );
}
