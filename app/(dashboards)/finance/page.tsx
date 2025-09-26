import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Financial Performance Dashboard",
  "Monitor revenue, expenses, and investment trends to optimize financial health."
);

/**
 * Finance Dashboard Page Component
 * This is the main page component for the Financial Performance dashboard
 * It sets up metadata for the dashboard and renders the RenderPage component
 * Provides an overview of revenue, expenses, and investment trends
 * @returns The JSX element representing the finance dashboard page
 */
export default function FinancePage() {
  return <RenderPage />;
}
