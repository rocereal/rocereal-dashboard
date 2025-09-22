import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import PricingPage from "./PricingPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Pricing Plans",
  "Choose the perfect plan for your business needs. Compare features and pricing."
);

export default function Page() {
  return <PricingPage />;
}
