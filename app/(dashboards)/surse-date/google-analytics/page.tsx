import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Google Analytics",
  "Monitorizare trafic și comportament utilizatori — rocereal.ro"
);

export default function GoogleAnalyticsPage() {
  return <RenderPage />;
}
