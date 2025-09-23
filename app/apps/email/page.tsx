import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Email Dashboard",
  "Manage your emails, organize communications, and stay connected with your team."
);

/**
 * Email Application Page Component
 * Main page component for the email application that renders the complete email interface
 * Uses metadata templates for SEO and page information
 * Serves as the entry point for the email dashboard with full email management capabilities
 * @returns The JSX element representing the email application page
 */
export default function EmailPage() {
  return <RenderPage />;
}
