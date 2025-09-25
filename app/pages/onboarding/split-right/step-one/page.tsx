/**
 * Split-Right Step One Onboarding Page
 * Server component that renders the first step of split-right onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.onboarding("Welcome");

export default function StepOnePage() {
  return <RenderPage />;
}
