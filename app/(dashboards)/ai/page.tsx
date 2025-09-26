/**
 * AI Dashboard Page Component
 * This is the main page component for the Artificial Intelligence dashboard
 * It sets up metadata for the dashboard and renders the RenderPage component
 * Provides an overview of AI models, user engagement, and business insights
 * @returns The JSX element representing the AI dashboard page
 */
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Artificial Intelligence Dashboard",
  "Monitor AI models, user engagement, and business intelligence insights with advanced analytics."
);

export default function AiPage() {
  return <RenderPage />;
}
