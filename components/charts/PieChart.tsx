"use client";

import * as React from "react";
import {
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface PieChartProps {
  data: any[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  className?: string;
}

export function PieChart({
  data,
  title = "Pie Chart",
  description = "Data distribution",
  dataKey = "value",
  nameKey = "name",
  className,
}: PieChartProps) {
  // Default colors for pie slices
  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316", // Orange
    "#ec4899", // Pink
    "#6366f1", // Indigo
  ];

  return (
    <Card className={`py-0 shadow-sm ${className || ""}`}>
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, percent }: any) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((entry, index) => (
            <div
              key={entry[nameKey]}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: entry.color || colors[index % colors.length],
                }}
              />
              <span className="truncate">{entry[nameKey]}</span>
              <span className="ml-auto font-medium">{entry[dataKey]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
