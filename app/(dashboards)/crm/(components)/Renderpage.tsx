"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { crmMetrics } from "@/data/crm-metrics";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientsTable } from "./ClientsTable";
import { SectionCards } from "./SectionCards";

export default function RenderPage() {
  const [totalCalls, setTotalCalls] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/crm/calls/count")
      .then((r) => r.json())
      .then((data) => setTotalCalls(data.count))
      .catch(() => {});
  }, []);

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

      <SectionCards metrics={crmMetrics.map((m) =>
        m.id === "total-customers" && totalCalls !== null
          ? { ...m, value: totalCalls.toLocaleString("ro-RO") }
          : m
      )} />

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <ClientsTable />
        </div>
      </div>
    </div>
  );
}
