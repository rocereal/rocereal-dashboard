import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Tracking Mașini",
  "Monitorizare în timp real a pozițiilor vehiculelor din flotă."
);

export default function TrackingPage() {
  return <RenderPage />;
}
