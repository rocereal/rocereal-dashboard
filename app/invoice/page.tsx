import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Invoice Management",
  "Manage your invoices, track payments, and generate reports."
);

export default function InvoicePage() {
  return <RenderPage />;
}
