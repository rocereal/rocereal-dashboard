"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

export default function RenderPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>({ from: today, to: todayEnd });

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Google Ads"
        subtitle="Track Google Ads performance, conversions, and campaign results."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Canale Marketing", href: "/education" },
          { label: "Google Ads" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Google Ads — în curând</CardTitle>
          <CardDescription>
            Integrarea cu Google Ads API urmează să fie configurată.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Odată conectat, această pagină va afișa campanii, impresii, CPC, conversii și costuri din contul tău Google Ads.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
