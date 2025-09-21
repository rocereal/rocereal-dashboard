import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import UsersPage from "./UsersPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "User Management",
  "Manage users, view profiles, and monitor user activity and metadata."
);

export default function Page() {
  return <UsersPage />;
}
