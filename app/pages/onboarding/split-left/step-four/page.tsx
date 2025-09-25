/**
 * Split-Left Step Four Onboarding Page
 * Server component that renders the final step of split-left onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Complete Setup - Fisio Onboarding",
  description:
    "Finish your Fisio dashboard setup and start exploring your personalized workspace.",
  keywords: [
    "onboarding",
    "setup",
    "completion",
    "dashboard",
    "fisio",
    "split-left",
    "step four",
    "final step",
  ],
  openGraph: {
    title: "Complete Setup - Fisio Onboarding",
    description:
      "Finish your Fisio dashboard setup and start exploring your personalized workspace.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Setup - Fisio Onboarding",
    description:
      "Finish your Fisio dashboard setup and start exploring your personalized workspace.",
  },
};

export default function StepFourPage() {
  return <RenderPage />;
}
