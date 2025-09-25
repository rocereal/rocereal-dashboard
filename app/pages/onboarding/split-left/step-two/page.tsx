/**
 * Split-Left Step Two Onboarding Page
 * Server component that renders the second step of split-left onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Account Setup - Fisio Onboarding",
  description:
    "Configure your account preferences and settings in the Fisio onboarding process.",
  keywords: [
    "onboarding",
    "setup",
    "preferences",
    "account",
    "dashboard",
    "fisio",
    "split-left",
    "step two",
  ],
  openGraph: {
    title: "Account Setup - Fisio Onboarding",
    description:
      "Configure your account preferences and settings in the Fisio onboarding process.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Account Setup - Fisio Onboarding",
    description:
      "Configure your account preferences and settings in the Fisio onboarding process.",
  },
};

export default function StepTwoPage() {
  return <RenderPage />;
}
