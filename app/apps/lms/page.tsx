/**
 * LMS Page Component
 * Main entry point for the Learning Management System application
 * Renders the complete LMS interface using the RenderPage component
 * Includes metadata for SEO and page description
 * @returns The JSX element representing the LMS application page
 */
import RenderPage from "./(components)/Renderpage";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Education Dashboard",
  "Monitor course performance, student engagement, and learning outcomes."
);

/**
 * LMS Application Page Component
 * Main page component for the Learning Management System that renders the complete LMS interface
 * Uses metadata templates for SEO and page information
 * Serves as the entry point for the education dashboard with full course management capabilities
 * @returns The JSX element representing the LMS application page
 */
export default function LmsPage() {
  return <RenderPage />;
}
