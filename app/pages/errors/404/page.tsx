/**
 * 404 Not Found Page Component
 * Error page displayed when users navigate to non-existent routes
 * Provides user-friendly 404 error interface with navigation options
 * Uses RenderPage component to display 404 error content
 * Part of the error handling section for broken or missing pages
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Page Not Found",
  "The page you're looking for isn't here. Return to Fisio's homepage to keep exploring."
);

/**
 * NotFoundPage component for 404 error handling
 * Renders the 404 error page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the 404 error page
 */
export default function NotFoundPage() {
  return <RenderPage />;
}
