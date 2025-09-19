import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Calendar Dashboard",
  "Stay on top of events, tasks, and team schedules with real-time insights."
);

export default function CalendarPage() {
  return <RenderPage />;
}
