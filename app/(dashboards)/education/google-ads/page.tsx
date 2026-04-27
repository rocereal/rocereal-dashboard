import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Google Ads",
  "Track Google Ads performance, conversions, and campaign results."
);

export default function GoogleAdsPage() {
  return <RenderPage />;
}
