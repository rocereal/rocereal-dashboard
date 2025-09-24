/**
 * Section Cards Component
 * Displays metric cards in a responsive grid layout for invoice dashboard
 * Shows key performance indicators with icons, values, and trend indicators
 * Used to display invoice statistics like total invoices, revenue, and payment status
 * @param metrics - Array of metric objects to display in cards
 * @param className - Additional CSS classes for styling
 * @returns JSX element representing the metrics cards grid
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CRMMetric } from "@/data/crm-metrics";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface SectionCardsProps {
  metrics?: CRMMetric[];
  className?: string;
}

/**
 * SectionCards component for displaying invoice metrics in card format
 * Renders responsive grid of metric cards with icons, values, and trend indicators
 * Provides visual representation of key invoice statistics and performance data
 * @param metrics - Optional array of metrics to display, defaults to empty array
 * @param className - Additional CSS classes for custom styling
 * @returns JSX element representing the metrics cards grid
 */
export function SectionCards({ metrics, className }: SectionCardsProps) {
  // Use provided metrics or default empty array
  const displayMetrics = metrics || [];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {displayMetrics.map((metric) => {
        const IconComponent = metric.icon;
        const isPositive = metric.changeType === "positive";

        return (
          <Card
            key={metric.id}
            className="relative overflow-hidden border !bg-card shadow-xs backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {IconComponent && (
                  <div className="bg-primary/20 size-8 items-center rounded-full flex justify-center">
                    <IconComponent className="h-3 w-3 rounded-full text-primary" />
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {metric.value}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs flex items-center gap-1",
                    isPositive
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
