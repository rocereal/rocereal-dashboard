"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { AiEmployeesSection } from "./AiEmployeesSection";
import { AttributionPanel }   from "./AttributionPanel";
import { SalesTargetWidget }  from "./SalesTargetWidget";
import { ZeroConversionAds }  from "./ZeroConversionAds";
import { NamingAlerts }       from "./NamingAlerts";

export default function RenderPage() {
  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Analiza AI"
        subtitle="7 angajați AI analizează ads, atribuire, copy, CRO, vânzări, stocuri și performanță business."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapoarte Financiare", href: "/finance" },
          { label: "Analiza AI" },
        ]}
      />

      <SalesTargetWidget />

      <AttributionPanel />

      <ZeroConversionAds />

      <NamingAlerts />

      <AiEmployeesSection />
    </div>
  );
}
