import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "../(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Products Management",
  "Manage your product catalog, inventory, and pricing."
);

/**
 * Products Page Component
 * This is the main page component for the products management section
 * It sets up the metadata for the products dashboard and renders the RenderPage component
 * which contains the full products interface including product listing, management, and analytics
 * @returns The JSX element representing the products page
 */
export default function ProductsPage() {
  return <RenderPage />;
}
