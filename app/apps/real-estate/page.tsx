import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Real Estate Management",
  "Manage your property listings, inquiries, and sales."
);

/**
 * Real Estate Page Component
 * This is the main page component for the real estate management section
 * It sets up the metadata for the real estate dashboard and renders the RenderPage component
 * which contains the full real estate interface including property listing, management, and analytics
 * @returns The JSX element representing the real estate page
 */
export default function RealEstatePage() {
  return <RenderPage />;
}
