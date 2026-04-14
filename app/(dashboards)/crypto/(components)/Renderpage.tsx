"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { financiarMetrics, vanzariDupaMotiv, vanzariDupaSursa } from "@/data/financiar-data";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { useState } from "react";
import { CereriDeschise } from "./CereriDeschise";
import { GaugeCard } from "./GaugeCard";
import { PrognozaBarChart } from "./PrognozaBarChart";
import { PrognozaMicaChart } from "./PrognozaMicaChart";
import { TopAgentiCard } from "./TopAgentiCard";
import { VanzariDonut } from "./VanzariDonut";


function MetricCard({
  label,
  valoare,
  trend,
  pozitiv,
}: {
  label: string;
  valoare: string;
  trend: string;
  pozitiv: boolean;
}) {
  return (
    <Card className="shadow-xs">
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{valoare}</p>
        <div
          className={`flex items-center gap-1 mt-1 text-xs font-medium ${
            pozitiv
              ? "text-green-600 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {pozitiv ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <AlertTriangle className="h-3 w-3" />
          )}
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function VandutCard() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Sold by me - dark card */}
      <Card className="bg-primary text-primary-foreground shadow-xs flex-1">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold opacity-80">
            Vandut luna aceasta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs opacity-70 mb-1">Luna curenta</p>
          <p className="text-3xl font-bold">2M EUR</p>
          <p className="text-xs opacity-60 mt-1">
            Target (Toate vanzarile): 580K EUR (0%)
          </p>
        </CardContent>
      </Card>

      {/* Activities card */}
      <Card className="shadow-xs flex-1">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold">
            Activitati in vanzari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-1">
            Data urmatoarei activitati a trecut
          </p>
          <p className="text-4xl font-bold text-red-500">11</p>
          <p className="text-xs text-muted-foreground mt-1">Trebuie sa fie: 0</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();

  return (
    <div className="flex flex-col space-y-4">
      <DashboardHeader
        title="Dashboard Financiar"
        subtitle="Monitorizeaza performanta vanzarilor, prognozele si activitatile echipei tale."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Dashboard Financiar" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {financiarMetrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1"><TopAgentiCard /></div>
        <div className="lg:col-span-2"><PrognozaBarChart /></div>
        <div className="lg:col-span-1"><GaugeCard value={36} /></div>
        <div className="lg:col-span-1"><VandutCard /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CereriDeschise />
        <VanzariDonut title="Vanzari castigate dupa motiv" data={vanzariDupaMotiv} />
        <VanzariDonut title="Vanzari castigate dupa sursa" data={vanzariDupaSursa} />
        <PrognozaMicaChart />
      </div>
    </div>
  );
}
