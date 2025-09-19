import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Financial Performance Dashboard",
  "Monitor revenue, expenses, and investment trends to optimize financial health."
);

export default function FinancePage() {
  return <RenderPage />;
}
