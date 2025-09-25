/**
 * Minimal Register Page
 * Server component that renders the minimal registration page with proper metadata
 * Provides SEO metadata and renders the client-side registration form component
 */

import { metadataTemplates } from "@/lib/metadata";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.auth("Sign Up");

export default function RegisterPage() {
  return <RenderPage />;
}
