import { metadataTemplates } from "@/lib/metadata";
import { Metadata } from "next";
import RenderPage from "./RenderPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Account Settings",
  "Manage your profile, preferences, and account details on Fisio."
);

export default function SettingsPage() {
  return <RenderPage />;
}
