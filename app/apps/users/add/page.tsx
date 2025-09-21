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
  url: "/apps/users/add",
});

export default function Page() {
  return <AddUserPage />;
}
