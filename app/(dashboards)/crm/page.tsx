import RenderPage from "./(components)/Renderpage";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Customer Relationship Dashboard",
  "Track pipeline health, customer engagement, and revenue performance in real time."
);

export default function CrmPage() {
  return <RenderPage />;
}
