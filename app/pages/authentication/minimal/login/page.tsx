/**
 * Minimal Login Page
 * Server component that renders the minimal login page with proper metadata
 * Provides SEO metadata and renders the client-side login form component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.auth("Sign In");

export default function LoginPage() {
  return <RenderPage />;
}
