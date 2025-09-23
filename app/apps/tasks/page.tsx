/**
 * Tasks Page Component
 * Main page for the tasks application that renders the complete tasks interface
 * Sets up metadata for the tasks dashboard and delegates rendering to RenderPage component
 * @returns The tasks page component
 */
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Tasks Dashboard",
  "Manage your tasks, track progress, and collaborate with your team efficiently."
);

/**
 * TasksPage function component
 * Renders the main tasks page by delegating to the RenderPage component
 * @returns JSX element for the tasks page
 */
export default function TasksPage() {
  return <RenderPage />;
}
