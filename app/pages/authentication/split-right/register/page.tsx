/**
 * Split-Right Register Page
 * Server component that renders the split-right register page with proper metadata
 * Provides SEO metadata and renders the client-side register form component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.auth("Sign Up");

export default function RegisterPage() {
  return <RenderPage />;
}
