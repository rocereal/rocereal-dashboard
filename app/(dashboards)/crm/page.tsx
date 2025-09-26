import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Customer Relationship Dashboard",
  "Track pipeline health, customer engagement, and revenue performance in real time."
);

/**
 * CRM Dashboard Page Component
 * This is the main page component for the Customer Relationship Management dashboard
 * It sets up metadata for the dashboard and renders the RenderPage component
 * Provides an overview of customer relationships, pipeline health, and revenue metrics
 * @returns The JSX element representing the CRM dashboard page
 */
export default function CrmPage() {
  return <RenderPage />;
}
