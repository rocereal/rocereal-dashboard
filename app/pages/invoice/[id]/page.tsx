import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Invoice Management",
  "Manage your invoices, track payments, and generate reports."
);

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePage({ params }: PageProps) {
  const { id } = await params;
  return <RenderPage id={id} />;
}
