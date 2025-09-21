import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddUserPage from "./AddUserPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Add User",
  "Create a new user account with profile information and settings."
);

export default function Page() {
  return <AddUserPage />;
}
