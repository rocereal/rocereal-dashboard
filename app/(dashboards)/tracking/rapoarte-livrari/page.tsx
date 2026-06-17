import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Rapoarte Livrări",
  "Rapoarte logistică: livrări, costuri transport, combustibil și eficiență pe vehicule și șoferi."
);

export default function RapoarteLibrariPage() {
  return <RenderPage />;
}
