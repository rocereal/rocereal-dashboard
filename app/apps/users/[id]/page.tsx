import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import UserDetailsPage from "./UserDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return createPageMetadata({
    title: "User Profile Details - Fisio Dashboard",
    description: "Detailed user profile information.",
    keywords: ["user profile", "user details", "account information"],
    url: `/apps/users/${id}`,
    type: "profile",
  });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailsPage userId={id} />;
}
