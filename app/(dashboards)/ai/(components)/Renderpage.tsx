"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";

import { FileText, Plus } from "lucide-react";
import { AITabs } from "./AITabs";

export default function RenderPage() {
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
