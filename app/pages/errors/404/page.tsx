import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Page Not Found",
  "The page you’re looking for isn’t here. Return to Fisio’s homepage to keep exploring."
);

export default function FourPage() {
  return <RenderPage />;
}
