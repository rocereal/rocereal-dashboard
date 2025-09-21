import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import PricingDesign2Page from "./PricingDesign2Page";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Pricing Plans - Alternative Design",
  "Explore our alternative pricing design with enhanced features and modern layout."
);

export default function Page() {
  return <PricingDesign2Page />;
}
