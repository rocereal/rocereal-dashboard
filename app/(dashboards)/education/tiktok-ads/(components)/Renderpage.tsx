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
        title="TikTok Ads"
        subtitle="Track TikTok Ads performance, reach, and campaign results."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Canale Marketing", href: "/education" },
          { label: "TikTok Ads" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">TikTok Ads — în curând</CardTitle>
          <CardDescription>
            Integrarea cu TikTok Marketing API urmează să fie configurată.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Odată conectat, această pagină va afișa campanii, reach, CPM, CTR și conversii din contul tău TikTok Ads.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
