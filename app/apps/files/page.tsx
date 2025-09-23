import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Files Dashboard",
  "Manage your files and folders with advanced organization and sharing capabilities."
);

/**
 * Files Application Page Component
 * Main page component for the files application that renders the complete file management interface
 * Uses metadata templates for SEO and page information
 * Serves as the entry point for the files dashboard with full file organization and sharing capabilities
 * @returns The JSX element representing the files application page
 */
export default function FilesPage() {
  return <RenderPage />;
}
