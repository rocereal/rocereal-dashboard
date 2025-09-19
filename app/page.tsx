import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.page(
  "Welcome to Fisio",
  "Your comprehensive dashboard for managing and monitoring applications. Access analytics, projects, and settings all in one place.",
  ["fisio", "dashboard", "welcome", "home"]
);

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome to Fisio
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Your dashboard for managing and monitoring your applications.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  View detailed analytics and insights for your applications.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your projects and track their progress.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your application preferences and settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
