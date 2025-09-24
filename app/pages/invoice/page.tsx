/**
 * Invoice Management Page Component
 * Main invoice dashboard page for managing invoices and financial documents
 * Provides overview of invoices, payment tracking, and reporting capabilities
 * Uses RenderPage component to display invoice management interface
 * Part of the invoice management section for business financial operations
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Invoice Management",
  "Manage your invoices, track payments, and generate reports."
);

/**
 * InvoicePage component for invoice management dashboard
 * Renders the invoice management page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the invoice management page
 */
export default function InvoicePage() {
  return <RenderPage />;
}
