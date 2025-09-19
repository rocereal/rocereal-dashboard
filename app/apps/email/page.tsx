import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Email Dashboard",
  "Manage your emails, organize communications, and stay connected with your team."
);

export default function EmailPage() {
  return <RenderPage />;
}
