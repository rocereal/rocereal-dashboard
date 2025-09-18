import RenderPage from "./(components)/Renderpage";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Education Dashboard",
  "Monitor course performance, student engagement, and learning outcomes."
);

export default function EducationPage() {
  return <RenderPage />;
}
