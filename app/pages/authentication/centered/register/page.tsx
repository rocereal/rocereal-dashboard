/**
 * Centered Register Page
 * Server component that renders the registration page with proper metadata
 * Provides SEO metadata and renders the client-side registration form component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Sign Up - Fisio Dashboard",
  description:
    "Create your Fisio dashboard account to start managing your projects and collaborating with your team.",
  keywords: ["register", "signup", "create account", "dashboard", "fisio"],
  openGraph: {
    title: "Sign Up - Fisio Dashboard",
    description:
      "Create your Fisio dashboard account to start managing your projects.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up - Fisio Dashboard",
    description:
      "Create your Fisio dashboard account to start managing your projects.",
  },
};

export default function RegisterPage() {
  return <RenderPage />;
}
