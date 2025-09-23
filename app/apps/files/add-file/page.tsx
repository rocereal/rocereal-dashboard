import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddFileRenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Add File",
  "Upload and share files with access controls"
);

/**
 * Add File Page Component
 * Main page component for the file upload interface that renders the complete add file form
 * Uses metadata templates for SEO and page information
 * Serves as the entry point for the file upload dashboard with full file management capabilities
 * @returns The JSX element representing the add file application page
 */
export default function AddFilePage() {
  return <AddFileRenderPage />;
}
