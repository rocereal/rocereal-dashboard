import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import UserDetailsPage from "./UserDetailsPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "User Details",
  "View detailed information about a user including profile, activity, and settings."
);

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <UserDetailsPage userId={params.id} />;
}
