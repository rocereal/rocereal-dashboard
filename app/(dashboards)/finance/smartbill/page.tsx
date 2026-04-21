import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Smartbill",
  "Rapoarte și facturi din SmartBill — venituri, cheltuieli și tranzacții."
);

export default function SmartbillPage() {
  return <RenderPage />;
}
