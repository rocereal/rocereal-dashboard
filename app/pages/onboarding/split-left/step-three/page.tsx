/**
 * Split-Left Step Three Onboarding Page
 * Server component that renders the third step of split-left onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.onboarding("Preferences");

export default function StepThreePage() {
  return <RenderPage />;
}
