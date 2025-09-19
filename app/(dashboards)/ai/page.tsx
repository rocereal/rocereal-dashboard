import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Artificial Intelligence Dashboard",
  "Monitor AI models, user engagement, and business intelligence insights with advanced analytics."
);

export default function AiPage() {
  return <RenderPage />;
}
