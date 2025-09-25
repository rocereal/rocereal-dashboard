/**
 * Minimal Reset Password Page
 * Server component that renders the minimal reset password page with proper metadata
 * Provides SEO metadata and renders the client-side reset password form component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = {
  title: "Set New Password - Fisio Dashboard",
  description:
    "Complete your password reset by setting a new secure password for your Fisio dashboard account.",
  keywords: [
    "set password",
    "new password",
    "password reset",
    "dashboard",
    "fisio",
    "minimal",
  ],
  openGraph: {
    title: "Set New Password - Fisio Dashboard",
    description:
      "Complete your password reset by setting a new secure password for your Fisio dashboard account.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Set New Password - Fisio Dashboard",
    description:
      "Complete your password reset by setting a new secure password for your Fisio dashboard account.",
  },
};

export default function ResetPasswordPage() {
  return <RenderPage />;
}
