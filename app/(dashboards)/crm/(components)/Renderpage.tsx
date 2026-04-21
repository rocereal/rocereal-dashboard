"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Users } from "lucide-react";
import { ClientsTable } from "./ClientsTable";

export default function RenderPage() {
  return (
    <div className="flex flex-col space-y-4">
      <DashboardHeader
        title="Raport Clienti"
        subtitle="CRM central — clienți unici din toate canalele, fără duplicate."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Management Clienti", href: "/crm" },
          { label: "Raport Clienti" },
        ]}
        primaryAction={{
          label: "Exportă",
          icon: <Users className="h-4 w-4" />,
        }}
      />

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <ClientsTable />
        </div>
      </div>
    </div>
  );
}
