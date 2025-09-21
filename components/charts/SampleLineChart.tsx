"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userActivityData } from "@/data/user-activity";

export interface LineChartDataItem {
  [key: string]: string | number | Date | undefined;
  date?: string | Date;
  dau?: number;
  wau?: number;
  mau?: number;
}

export interface LineChartProps {
  data?: LineChartDataItem[];
  title?: string;
  description?: string;
  config?: ChartConfig;
  dataKeys?: string[];
  dateKey?: string;
  showTimeRange?: boolean;
  showCoinSelector?: boolean;
  selectedCoin?: string;
  onCoinChange?: (coin: string) => void;
  cryptoCoins?: Array<{
    id: string;
    name: string;
    symbol: string;
    icon: string;
  }>;
  className?: string;
}

const defaultConfig: ChartConfig = {
  dau: {
    label: "Daily Active Users",
    color: "var(--chart-1)",
  },
  wau: {
    label: "Weekly Active Users",
    color: "var(--chart-2)",
  },
  mau: {
    label: "Monthly Active Users",
    color: "var(--chart-3)",
  },
};

export function SampleLineChart({
  data = userActivityData,
  title = "User Activity Over Time",
  description = "Daily, Weekly, and Monthly Active Users",
  config = defaultConfig,
  dataKeys = ["dau", "wau", "mau"],
  dateKey = "date",
  showTimeRange = true,
  showCoinSelector = false,
  selectedCoin,
  onCoinChange,
  cryptoCoins = [],
  className,
}: LineChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      const dateValue = item[dateKey];
      if (!dateValue) return false;
      const date = new Date(dateValue);
      const referenceDate = new Date("2025-09-18"); // Updated to current date
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [data, dateKey, timeRange]);

  return (
    <Card className={`pt-0 shadow-xs ${className || ""}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {showCoinSelector && cryptoCoins.length > 0 && (
            <Select value={selectedCoin} onValueChange={onCoinChange}>
              <SelectTrigger className="w-[140px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptoCoins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{coin.icon}</span>
                      <span>{coin.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {showTimeRange && (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] rounded-lg">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={config} className="h-full w-full">
          <AreaChart data={filteredData}>
            <defs>
              {dataKeys.map((key, index) => (
                <linearGradient
                  key={index}
                  id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={dateKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(
                      value as string | number | Date
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {dataKeys.map((key, index) => (
              <Area
                key={index}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key.charAt(0).toUpperCase() + key.slice(1)})`}
                stroke={`var(--color-${key})`}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
