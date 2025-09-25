/**
 * Split-Right Step Four Onboarding Page
 * Server component that renders the final step of split-right onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.onboarding("Complete Setup");

export default function StepFourPage() {
  return <RenderPage />;
}
