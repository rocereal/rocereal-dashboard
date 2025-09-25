/**
 * Split-Left Step Two Onboarding Page
 * Server component that renders the second step of split-left onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.onboarding("Account Setup");

export default function StepTwoPage() {
  return <RenderPage />;
}
