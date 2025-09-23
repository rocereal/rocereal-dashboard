/**
 * User Details Page Component
 * Dynamic page for displaying individual user profile details
 * Generates metadata for SEO and renders the user details interface
 * @returns The user details page component
 */

import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import UserDetailsPage from "./UserDetailsPage";

interface PageProps {
  params: {
    id: string;
  };
}

/**
 * Generates metadata for the user details page
 * @param params - Page parameters containing the user ID
 * @returns Metadata object for SEO and social sharing
 */
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

/**
 * Page function component for user details
 * Renders the user details page by passing the user ID to UserDetailsPage component
 * @param params - Page parameters containing the user ID
 * @returns JSX element for the user details page
 */
export default function Page({ params }: PageProps) {
  return <UserDetailsPage userId={params.id} />;
}
