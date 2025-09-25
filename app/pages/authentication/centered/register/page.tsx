/**
 * Centered Register Page
 * Server component that renders the registration page with proper metadata
 * Provides SEO metadata and renders the client-side registration form component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata = metadataTemplates.auth("Sign Up");

export default function RegisterPage() {
  return <RenderPage />;
}
