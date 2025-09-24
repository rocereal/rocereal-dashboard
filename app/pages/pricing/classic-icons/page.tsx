/**
 * Classic Icons Pricing Page Component
 * Alternative pricing page design with classic icons and enhanced visual layout
 * Provides pricing information with comparison features and testimonials
 * Uses RenderPage component to display comprehensive pricing interface
 * Part of the pricing section with alternative design approach
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Pricing Plans - Classic Design",
  "Explore our classic pricing design with enhanced features and modern layout."
);

/**
 * ClassicIconsPricingPage component for the alternative pricing design
 * Renders the classic icons pricing page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the classic icons pricing page
 */
export default function ClassicIconsPricingPage() {
  return <RenderPage />;
}
