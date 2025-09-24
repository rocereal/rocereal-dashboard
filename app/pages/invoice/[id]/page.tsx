/**
 * Invoice Detail Page Component
 * Dynamic page for displaying individual invoice details and information
 * Fetches invoice data based on URL parameter ID and renders detailed view
 * Uses RenderPage component to display comprehensive invoice information
 * Part of the invoice management system for viewing specific invoices
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Invoice Details",
  "View detailed information about your invoice including items, amounts, and payment status."
);

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * InvoicePage component for displaying individual invoice details
 * Asynchronous component that extracts invoice ID from URL parameters
 * Renders the invoice detail page using the RenderPage component
 * @param params - Promise containing URL parameters including invoice ID
 * @returns JSX element representing the invoice detail page
 */
export default async function InvoicePage({ params }: PageProps) {
  const { id } = await params;
  return <RenderPage id={id} />;
}
