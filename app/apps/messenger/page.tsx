import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Messenger Dashboard",
  "Communicate with your team members and manage conversations efficiently."
);

export default function MessengerPage() {
  return <RenderPage />;
}
