import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Tasks Dashboard",
  "Manage your tasks, track progress, and collaborate with your team efficiently."
);

export default function ContactFormPage() {
  return <RenderPage />;
}
