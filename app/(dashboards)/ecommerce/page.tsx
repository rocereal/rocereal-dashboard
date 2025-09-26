import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "E-commerce Performance Dashboard",
  "Monitor sales, customer behavior, and product performance to drive growth."
);

/**
 * E-commerce Dashboard Page Component
 * This is the main page component for the E-commerce Performance dashboard
 * It sets up metadata for the dashboard and renders the RenderPage component
 * Provides an overview of sales metrics, customer behavior, and product performance
 * @returns The JSX element representing the e-commerce dashboard page
 */
export default function EcommercePage() {
  return <RenderPage />;
}
