import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { metadataTemplates } from "@/lib/metadata";
import { FileText, Plus } from "lucide-react";
import type { Metadata } from "next";
import { AITabs } from "./(components)/AITabs";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Artificial Intelligence Dashboard",
  "Monitor AI models, user engagement, and business intelligence insights with advanced analytics."
);

export default function AiPage() {
  return (
    <div className="flex flex-col space-y-4">
      <DashboardHeader
        title="Artificial Intelligence"
        subtitle="Monitor AI models, user engagement, and business intelligence"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Artificial Intelligence" },
        ]}
        primaryAction={{
          label: "Add Model",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Generate Report",
          icon: <FileText className="h-4 w-4" />,
        }}
      />

      <AITabs />
    </div>
  );
}
