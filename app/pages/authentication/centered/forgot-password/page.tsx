/**
 * Centered Forgot Password Page
 * Server component that renders the forgot password page with proper metadata
 * Provides SEO metadata and renders the client-side forgot password form component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.auth("Reset Password");

export default function ForgotPasswordPage() {
  return <RenderPage />;
}
