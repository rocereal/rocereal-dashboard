"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimeSpentChartProps {
  data: Array<{
    course: string;
    hours: number;
  }>;
}

/**
 * Time Spent Chart Component
 * Displays a bar chart showing time spent on different courses
 * Visualizes the average time spent by course in hours using Recharts
 * @param data - Array of data points with course name and hours spent
 * @returns The JSX element representing the time spent bar chart
 */
export function TimeSpentChart({ data }: TimeSpentChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="course"
            axisLine={false}
            tickLine={false}
            className="text-xs text-muted-foreground"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs text-muted-foreground"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(0 0% 90%)",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "hsl(0 0% 9%)" }}
            formatter={(value: number) => [`${value} hours`, "Time Spent"]}
          />
          <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
