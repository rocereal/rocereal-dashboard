/**
 * Task Details Page Component
 * Dynamic page for displaying individual task details based on the task ID
 * Sets up metadata for the task details view and renders the task details interface
 * @returns The task details page component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Tasks Dashboard",
  "Manage your tasks, track progress, and collaborate with your team efficiently."
);

/**
 * DetailsMessengerPage function component
 * Renders the task details page by delegating to the RenderPage component
 * @returns JSX element for the task details page
 */
export default function DetailsMessengerPage() {
  return <RenderPage />;
}
