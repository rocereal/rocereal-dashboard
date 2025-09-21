import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Products Management",
  "Manage your product catalog, inventory, and pricing."
);

export default function ProductsPage() {
  return <RenderPage />;
}
