/**
 * Settings Page Component
 * Main settings page displaying user account management interface
 * Provides comprehensive settings interface with profile, security, privacy, and notifications
 * Uses RenderPage component to display organized settings sections
 * Part of the user account management system for Fisio platform
 */

import { metadataTemplates } from "@/lib/metadata";
import { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.page(
  "Account Settings",
  "Manage your profile, preferences, and account details on Fisio."
);

/**
 * SettingsPage component for the account settings section
 * Renders the settings page using the RenderPage component
 * Provides metadata for SEO and page identification
 * @returns JSX element representing the settings page
 */
export default function SettingsPage() {
  return <RenderPage />;
}
