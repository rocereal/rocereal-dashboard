/**
 * Split-Left Forgot Password Page
 * Server component that renders the split-left forgot password page with proper metadata
 * Provides SEO metadata and renders the client-side forgot password form component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Reset Password - Fisio Dashboard",
  description:
    "Request a password reset link to regain access to your Fisio dashboard account.",
  keywords: [
    "reset password",
    "forgot password",
    "password recovery",
    "dashboard",
    "fisio",
    "split-left",
  ],
  openGraph: {
    title: "Reset Password - Fisio Dashboard",
    description:
      "Request a password reset link to regain access to your Fisio dashboard account.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password - Fisio Dashboard",
    description:
      "Request a password reset link to regain access to your Fisio dashboard account.",
  },
};

export default function ForgotPasswordPage() {
  return <RenderPage />;
}
