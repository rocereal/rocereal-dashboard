"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

interface DonutItem {
  name: string;
  value: number;
  color: string;
  [key: string]: unknown;
}

interface VanzariDonutProps {
  title: string;
  data: DonutItem[];
}

function formatEUR(val: number) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M EUR`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K EUR`;
  return `${val} EUR`;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-md shadow-md p-2 text-xs">
        <p className="font-medium">{payload[0].name}</p>
        <p>{formatEUR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function VanzariDonut({ title, data }: VanzariDonutProps) {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <PieChart width={200} height={160}>
          <Pie
            data={data}
            cx={95}
            cy={75}
            innerRadius={45}
            outerRadius={75}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
