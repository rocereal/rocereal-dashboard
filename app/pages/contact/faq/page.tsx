/**
 * FAQ Page Component
 * Frequently Asked Questions page for user support and information
 * Provides searchable FAQ accordion with common questions and answers
 * Includes contact CTA for additional support needs
 * Part of the contact section for user assistance
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Frequently Asked Questions",
  "Find answers to common questions about our services, features, and support. Get help with your inquiries."
);

/**
 * FAQPage component for the frequently asked questions section
 * Renders the FAQ page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the FAQ page
 */
export default function FAQPage() {
  return <RenderPage />;
}
