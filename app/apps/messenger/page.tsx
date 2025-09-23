/**
 * Messenger Page Component
 * Main page for the messenger application that renders the complete messenger interface
 * Sets up metadata for the messenger dashboard and delegates rendering to RenderPage component
 * @returns The messenger page component
 */
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Messenger Dashboard",
  "Communicate with your team members and manage conversations efficiently."
);

/**
 * MessengerPage function component
 * Renders the main messenger page by delegating to the RenderPage component
 * @returns JSX element for the messenger page
 */
export default function MessengerPage() {
  return <RenderPage />;
}
