"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface FunnelChartProps {
  data: Array<{
    stage: string;
    users: number;
    percentage: number;
    color?: string;
  }>;
  title?: string;
  description?: string;
  className?: string;
}

export function FunnelChart({
  data,
  title = "Funnel Chart",
  description = "User journey conversion",
  className,
}: FunnelChartProps) {
  const maxUsers = Math.max(...data.map((item) => item.users));

  return (
    <Card className={`py-0 shadow-xs ${className || ""}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:py-2">
        <div className="space-y-4">
          {data.map((item, index) => {
            const width = (item.users / maxUsers) * 100;
            const colors = [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
            ];

            return (
              <div key={item.stage} className="flex items-center gap-4">
                <div className="w-fit text-sm font-medium text-right">
                  {item.stage}
                </div>
                <div className="flex-1 relative">
                  <div
                    className="h-12 rounded transition-all duration-300 hover:opacity-80"
                    style={{
                      width: `${width}%`,
                      backgroundColor:
                        item.color || colors[index % colors.length],
                      marginLeft: `${(100 - width) / 2}%`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                    {item.users.toLocaleString()} ({item.percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conversion rates */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Conversion Rates</h4>
          <div className="space-y-2">
            {data.slice(1).map((item, index) => {
              const previousItem = data[index];
              const conversionRate = (
                (item.users / previousItem.users) *
                100
              ).toFixed(1);

              return (
                <div key={item.stage} className="flex justify-between text-sm">
                  <span>
                    {previousItem.stage} → {item.stage}
                  </span>
                  <span className="font-medium">{conversionRate}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
