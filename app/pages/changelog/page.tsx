import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Monitorizare Sisteme",
  "Status în timp real al integrărilor și serviciilor externe"
);

export default function MonitorizareSistemePage() {
  return <RenderPage />;
}
