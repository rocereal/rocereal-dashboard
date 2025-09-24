/**
 * Maintenance Mode Page Component
 * Maintenance page displayed when the application is undergoing scheduled maintenance
 * Provides user-friendly maintenance interface with status information
 * Uses RenderPage component to display maintenance content
 * Part of the error handling section for system maintenance periods
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Maintenance Mode",
  "We're working on improvements. Fisio will be back online shortly."
);

/**
 * MaintenancePage component for maintenance mode handling
 * Renders the maintenance page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the maintenance page
 */
export default function MaintenancePage() {
  return <RenderPage />;
}
