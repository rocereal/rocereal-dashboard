import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Pricing Plans - Alternative Design",
  "Explore our alternative pricing design with enhanced features and modern layout."
);

export default function Page() {
  return <RenderPage />;
}
