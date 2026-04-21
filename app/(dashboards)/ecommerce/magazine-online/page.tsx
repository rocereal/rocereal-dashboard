import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Magazine Online",
  "Monitor sales, customer behavior, and product performance to drive growth."
);

export default function MagazineOnlinePage() {
  return <RenderPage />;
}
