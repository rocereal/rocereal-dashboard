"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { prognozaTrimestru } from "@/data/financiar-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const config = {
  actual: { label: "Realizat", color: "var(--chart-1)" },
  prognoza: { label: "Prognoza", color: "var(--muted-foreground)" },
};

function formatEUR(val: number) {
  if (val === 0) return "";
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return `${val}`;
}

export function PrognozaMicaChart() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Prognoze trimestru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[220px] w-full">
          <BarChart
            data={prognozaTrimestru}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="luna"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatEUR}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value: number, name: string) => [
                    `${formatEUR(value)} EUR`,
                    name === "actual" ? "Realizat" : "Prognoza",
                  ]}
                />
              }
            />
            <Bar
              dataKey="actual"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="prognoza"
              fill="var(--muted-foreground)"
              opacity={0.4}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
