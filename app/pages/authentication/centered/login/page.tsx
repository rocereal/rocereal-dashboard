/**
 * Centered Login Page
 * Server component that renders the login page with proper metadata
 * Provides SEO metadata and renders the client-side login form component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Sign In - Fisio Dashboard",
  description:
    "Sign in to your Fisio dashboard account to access your workspace and manage your projects.",
  keywords: ["login", "signin", "authentication", "dashboard", "fisio"],
  openGraph: {
    title: "Sign In - Fisio Dashboard",
    description:
      "Sign in to your Fisio dashboard account to access your workspace.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In - Fisio Dashboard",
    description:
      "Sign in to your Fisio dashboard account to access your workspace.",
  },
};

export default function LoginPage() {
  return <RenderPage />;
}
