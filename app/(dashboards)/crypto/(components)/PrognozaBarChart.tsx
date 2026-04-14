"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { prognozaOwnerData } from "@/data/financiar-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const config = {
  valoare: { label: "Valoare", color: "var(--chart-1)" },
};

function formatEUR(val: number) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return `${val}`;
}

export function PrognozaBarChart() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Prognoze trimestru pe proprietar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[220px] w-full">
          <BarChart data={prognozaOwnerData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatEUR}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${formatEUR(Number(value))} EUR`, "Valoare"]}
                />
              }
            />
            <Bar dataKey="valoare" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
