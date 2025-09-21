"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricData } from "@/data/analytics";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicCardProps {
  metric: MetricData;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Type-safe icon accessor
function getIconComponent(iconName: string) {
  return (Icons as Record<string, unknown>)[iconName] as React.ComponentType<{
    className?: string;
  }> | null;
}

export function DynamicCard({
  metric,
  className,
  size = "md",
}: DynamicCardProps) {
  const IconComponent = metric.icon
    ? getIconComponent(metric.icon) || Icons.BarChart3
    : Icons.BarChart3;

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const titleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const valueSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 pb-2",
          sizeClasses[size]
        )}
      >
        <CardTitle
          className={cn("text-sm font-medium", titleSizeClasses[size])}
        >
          {metric.title}
        </CardTitle>
        {IconComponent && (
          <IconComponent
            className={cn(
              "h-4 w-4 text-muted-foreground",
              size === "lg" && "h-5 w-5"
            )}
          />
        )}
      </CardHeader>
      <CardContent className={sizeClasses[size]}>
        <div className={cn("text-2xl font-bold", valueSizeClasses[size])}>
          {metric.value}
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Badge
            variant={
              metric.changeType === "positive"
                ? "default"
                : metric.changeType === "negative"
                ? "destructive"
                : "secondary"
            }
            className={cn(
              "text-xs flex items-center gap-1",
              metric.changeType === "positive" &&
                "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
              metric.changeType === "negative" &&
                "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
            )}
          >
            {metric.changeType === "positive" && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
            {metric.changeType === "negative" && (
              <div className="w-2 h-2 rounded-full bg-red-500" />
            )}
            {metric.change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
