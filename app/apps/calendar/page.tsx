import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/Renderpage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Calendar Dashboard",
  "Stay on top of events, tasks, and team schedules with real-time insights."
);

/**
 * Calendar Page Component
 * This is the main page component for the calendar application
 * It sets up the metadata for the calendar dashboard and renders the RenderPage component
 * which contains the full calendar interface including events, scheduling, and team coordination features
 * @returns The JSX element representing the calendar page
 */
export default function CalendarPage() {
  return <RenderPage />;
}
