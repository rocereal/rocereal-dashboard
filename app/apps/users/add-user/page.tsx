/**
 * Add User Page Component
 * Page for creating new user accounts with comprehensive setup
 * Sets up metadata for SEO and renders the add user interface
 * @returns The add user page component
 */

import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import AddUserPage from "./AddUserPage";

export const metadata: Metadata = createPageMetadata({
  title: "Add New User - Fisio Dashboard",
  description:
    "Create a new user account with comprehensive profile setup including personal information, professional details, security settings, and account preferences.",
  keywords: [
    "add user",
    "create user",
    "new user",
    "user registration",
    "account setup",
    "user onboarding",
    "profile creation",
  ],
  url: "/apps/users/add-user",
});

/**
 * Page function component for adding users
 * Renders the add user page by delegating to the AddUserPage component
 * @returns JSX element for the add user page
 */
export default function Page() {
  return <AddUserPage />;
}
