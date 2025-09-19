import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Crypto Performance Dashboard",
  "Track live market trends, portfolio performance, and trading activity in real time."
);

export default function CryptoPage() {
  return <RenderPage />;
}
