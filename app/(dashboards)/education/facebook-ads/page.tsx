import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Facebook Ads",
  "Track student progress, course performance, and engagement across programs."
);

export default function FacebookAdsPage() {
  return <RenderPage />;
}
