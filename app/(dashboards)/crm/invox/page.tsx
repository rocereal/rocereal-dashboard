import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Invox Dashboard",
  "Track pipeline health, customer engagement, and revenue performance in real time."
);

export default function InvoxPage() {
  return <RenderPage />;
}
