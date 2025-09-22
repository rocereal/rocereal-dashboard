import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Maintenance Mode",
  "We’re working on improvements. Fisio will be back online shortly."
);

export default function ContactFormPage() {
  return <RenderPage />;
}
