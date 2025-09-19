import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "E-commerce Performance Dashboard",
  "Monitor sales, customer behavior, and product performance to drive growth."
);

export default function EcommercePage() {
  return <RenderPage />;
}
