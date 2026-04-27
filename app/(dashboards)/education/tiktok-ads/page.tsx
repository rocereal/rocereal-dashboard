import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "TikTok Ads",
  "Track TikTok Ads performance, reach, and campaign results."
);

export default function TikTokAdsPage() {
  return <RenderPage />;
}
