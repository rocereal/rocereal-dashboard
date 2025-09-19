import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Files Dashboard",
  "Manage your files and folders with advanced organization and sharing capabilities."
);

export default function FilesPage() {
  return <RenderPage />;
}
