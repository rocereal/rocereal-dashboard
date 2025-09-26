import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Crypto Performance Dashboard",
  "Track live market trends, portfolio performance, and trading activity in real time."
);

/**
 * Crypto Dashboard Page Component
 * This is the main page component for the Crypto Performance dashboard
 * It sets up metadata for the dashboard and renders the RenderPage component
 * Provides an overview of cryptocurrency market trends, portfolio performance, and trading activity
 * @returns The JSX element representing the crypto dashboard page
 */
export default function CryptoPage() {
  return <RenderPage />;
}
