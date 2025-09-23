/**
 * Create Task Page Component
 * Page for creating new tasks with form interface
 * Sets up metadata for the task creation view and renders the create task interface
 * @returns The create task page component
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Tasks Dashboard",
  "Manage your tasks, track progress, and collaborate with your team efficiently."
);

/**
 * CreateMessengerPage function component
 * Renders the create task page by delegating to the RenderPage component
 * @returns JSX element for the create task page
 */
export default function CreateMessengerPage() {
  return <RenderPage />;
}
