/**
 * Split-Left Step Three Onboarding Page
 * Server component that renders the third step of split-left onboarding with proper metadata
 * Provides SEO metadata and renders the client-side onboarding step component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Preferences - Fisio Onboarding",
  description:
    "Set up your dashboard preferences and customize your Fisio experience.",
  keywords: [
    "onboarding",
    "setup",
    "preferences",
    "customization",
    "dashboard",
    "fisio",
    "split-left",
    "step three",
  ],
  openGraph: {
    title: "Preferences - Fisio Onboarding",
    description:
      "Set up your dashboard preferences and customize your Fisio experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preferences - Fisio Onboarding",
    description:
      "Set up your dashboard preferences and customize your Fisio experience.",
  },
};

export default function StepThreePage() {
  return <RenderPage />;
}
