"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface CustomBarChartProps {
  data: any[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  layout?: "vertical" | "horizontal";
  className?: string;
}

export function CustomBarChart({
  data,
  title = "Bar Chart",
  description = "Data visualization",
  dataKey = "value",
  nameKey = "name",
  layout = "vertical",
  className,
}: CustomBarChartProps) {
  const isHorizontal = layout === "horizontal";

  // Default colors array - fallback if no color provided
  const defaultColors = [
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
    <Card className={`py-0 shadow-xs ${className || ""}`}>
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
            <BarChart
              data={data}
              layout={layout}
              margin={
                isHorizontal
                  ? {
                      left: 100,
                      right: 20,
                      top: 20,
                      bottom: 20,
                    }
                  : {
                      left: 20,
                      right: 20,
                      top: 20,
                      bottom: 60,
                    }
              }
            >
              {isHorizontal ? (
                <>
                  <YAxis
                    dataKey={nameKey}
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={90}
                    fontSize={12}
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={nameKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Bar
                dataKey={dataKey}
                radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.color || defaultColors[index % defaultColors.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
