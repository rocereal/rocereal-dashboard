/**
 * Contact Form Page Component
 * Main contact form page for user inquiries and support requests
 * Provides comprehensive contact form with validation and submission handling
 * Uses RenderPage component to display contact form interface
 * Part of the contact section for user communication
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Contact Form",
  "Get in touch with us. Send us your questions, feedback, or support requests through our contact form."
);

/**
 * ContactFormPage component for the contact form section
 * Renders the contact form page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the contact form page
 */
export default function ContactFormPage() {
  return <RenderPage />;
}
