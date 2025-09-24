/**
 * Add Invoice Page Component
 * Page for creating new invoices with comprehensive form interface
 * Provides step-by-step invoice creation process with all necessary fields
 * Uses AddInvoiceForm component to handle the complete invoice creation workflow
 * Part of the invoice management system for adding new invoices
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddInvoiceForm from "./AddInvoiceForm";

export const metadata: Metadata = metadataTemplates.page(
  "Create Invoice",
  "Create a new invoice with all necessary details including client info, items, and payment terms."
);

/**
 * AddInvoicePage component for the invoice creation interface
 * Renders the add invoice page with the comprehensive form component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the invoice creation page
 */
export default function AddInvoicePage() {
  return (
    <div className="container mx-auto py-6">
      <AddInvoiceForm />
    </div>
  );
}
