import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  redirect(`/apps/users/${session.user.id}`);
}
