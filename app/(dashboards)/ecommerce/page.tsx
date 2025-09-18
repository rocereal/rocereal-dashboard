import RenderPage from "./(components)/Renderpage";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.dashboard(
  "E-commerce Performance Dashboard",
  "Monitor sales, customer behavior, and product performance to drive growth."
);

export default function EcommercePage() {
  return <RenderPage />;
}
