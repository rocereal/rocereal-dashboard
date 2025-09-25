/**
 * Centered Reset Password Page
 * Server component that renders the reset password page with proper metadata
 * Provides SEO metadata and renders the client-side reset password form component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.auth("Set New Password");

export default function ResetPasswordPage() {
  return <RenderPage />;
}
