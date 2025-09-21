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

export default function Page() {
  return <UsersPage />;
}
