/**
 * Split-Right Step One Onboarding Page
 * Server component that renders the first step of split-right onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Welcome - Fisio Onboarding",
  description:
    "Start your Fisio dashboard journey with our guided onboarding process. Set up your account and preferences.",
  keywords: [
    "onboarding",
    "setup",
    "welcome",
    "dashboard",
    "fisio",
    "split-right",
    "step one",
  ],
  openGraph: {
    title: "Welcome - Fisio Onboarding",
    description:
      "Start your Fisio dashboard journey with our guided onboarding process.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome - Fisio Onboarding",
    description:
      "Start your Fisio dashboard journey with our guided onboarding process.",
  },
};

export default function StepOnePage() {
  return <RenderPage />;
}
