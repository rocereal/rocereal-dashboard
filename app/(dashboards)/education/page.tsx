import RenderPage from "./(components)/Renderpage";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Learning Performance Dashboard",
  "Track student progress, course performance, and engagement across programs."
);

/**
 * Education Dashboard Page Component
 * This is the main page component for the Learning Performance dashboard
 * It sets up metadata for the dashboard and renders the RenderPage component
 * Provides an overview of student progress, course performance, and engagement metrics
 * @returns The JSX element representing the education dashboard page
 */
export default function EducationPage() {
  return <RenderPage />;
}
