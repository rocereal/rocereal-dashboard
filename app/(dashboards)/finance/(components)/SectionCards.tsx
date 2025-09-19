import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricData } from "@/data/analytics";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface SectionCardsProps {
  metrics?: MetricData[];
  className?: string;
}

const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case "DollarSign":
      return DollarSign;
    case "TrendingDown":
      return TrendingDown;
    case "BarChart3":
      return BarChart3;
    case "Wallet":
      return Wallet;
    case "Percent":
      return BarChart3;
    case "ArrowUpDown":
      return TrendingUp;
    default:
      return DollarSign;
  }
};

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
        const IconComponent = getIconComponent(metric.icon);
        const isPositive = metric.changeType === "positive";
        const isNegative = metric.changeType === "negative";

        return (
          <Card
            key={metric.id}
            className="relative overflow-hidden border bg-card/50 shadow-xs backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {IconComponent && (
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
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
                      : isNegative
                      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : isNegative ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {metric.change || "No change"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
