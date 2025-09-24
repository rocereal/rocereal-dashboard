/**
 * Pricing Plans Page Component
 * Main pricing plans page displaying various subscription tiers and pricing options
 * Provides comprehensive pricing information with plan comparisons and features
 * Uses PricingPage component to render detailed pricing interface
 * Part of the pricing section for business subscription management
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import PricingPage from "./PricingPage";

export const metadata: Metadata = metadataTemplates.page(
  "Pricing Plans",
  "Choose the perfect plan for your business needs. Compare features and pricing."
);

/**
 * PricingPlansPage component for the pricing plans section
 * Renders the pricing plans page using the PricingPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the pricing plans page
 */
export default function PricingPlansPage() {
  return <PricingPage />;
}
