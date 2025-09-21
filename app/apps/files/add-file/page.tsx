import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddFileRenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Add File",
  "Upload and share files with access controls"
);

export default function AddFilePage() {
  return <AddFileRenderPage />;
}
