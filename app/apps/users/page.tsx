/**
 * Users Page Component
 * Main entry point for the users management application
 * Sets up metadata for SEO and renders the UsersPage component
 * @returns The users page component
 */

import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import UsersPage from "./UsersPage";

export const metadata: Metadata = createPageMetadata({
  title: "User Management - Fisio Dashboard",
  description:
    "Comprehensive user management system. View, edit, and manage user accounts, roles, and permissions. Monitor user activity, login history, and account status.",
  keywords: [
    "user management",
    "users",
    "accounts",
    "admin",
    "dashboard",
    "user profiles",
    "permissions",
    "roles",
  ],
  url: "/apps/users",
});

/**
 * Page function component
 * Renders the users page by delegating to the UsersPage component
 * @returns JSX element for the users page
 */
export default function Page() {
  return <UsersPage />;
}
