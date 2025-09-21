import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import UserDetailsPage from "./UserDetailsPage";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return createPageMetadata({
    title: "User Profile Details - Fisio Dashboard",
    description:
      "Detailed user profile information including personal details, professional information, activity history, security settings, and account preferences.",
    keywords: [
      "user profile",
      "user details",
      "account information",
      "user activity",
      "security settings",
      "profile management",
    ],
    url: `/apps/users/${params.id}`,
    type: "profile",
  });
}

export default function Page({ params }: PageProps) {
  return <UserDetailsPage userId={params.id} />;
}
