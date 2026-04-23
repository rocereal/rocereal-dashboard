"use client";

import { useCallback, useEffect, useState } from "react";
import { TrendingDown, TrendingUp, Minus, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { cn } from "@/lib/utils";

interface MetricGroup {
  count: number;
  total: number;
  prevCount: number;
  prevTotal: number;
  pctCount: number | null;
  pctTotal: number | null;
}

interface FinanceMetricsData {
  incasate: MetricGroup;
  stornate: MetricGroup;
  emise: MetricGroup;
}

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0,
  }).format(v);

function TrendBadge({ pct, inverseColor = false }: { pct: number | null; inverseColor?: boolean }) {
  if (pct === null) {
    return (
      <Badge variant="outline" className="text-xs flex items-center gap-1 bg-gray-50 text-gray-500 border-gray-200">
        <Minus className="h-3 w-3" />
        Fără date anterioare
      </Badge>
    );
  }

  const isPositive = pct > 0;
  const isGood = inverseColor ? !isPositive : isPositive;
  const isNeutral = pct === 0;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs flex items-center gap-1",
        isNeutral
          ? "bg-gray-50 text-gray-500 border-gray-200"
          : isGood
          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      )}
    >
      {isNeutral ? (
        <Minus className="h-3 w-3" />
      ) : isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isNeutral ? "Nicio schimbare" : `${isPositive ? "+" : ""}${pct}% față de perioada anterioară`}
    </Badge>
  );
}

function MetricCard({
  title,
  icon: Icon,
  iconClass,
  total,
  count,
  pctTotal,
  inverseColor = false,
  loading,
}: {
  title: string;
  icon: React.ElementType;
  iconClass: string;
  total: number;
  count: number;
  pctTotal: number | null;
  inverseColor?: boolean;
  loading: boolean;
}) {
  return (
    <Card className="relative overflow-hidden border !bg-card shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("size-8 flex items-center justify-center rounded-full", iconClass)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-32 mt-1" />
        ) : (
          <div className="text-2xl font-bold tabular-nums">{fmtRON(total)}</div>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {loading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <p className="text-xs text-muted-foreground">
            {count} {count === 1 ? "factură" : "facturi"}
          </p>
        )}
        {loading ? (
          <Skeleton className="h-5 w-40" />
        ) : (
          <TrendBadge pct={pctTotal} inverseColor={inverseColor} />
        )}
      </CardContent>
    </Card>
  );
}

interface Props {
  dateRange?: DateTimeRange;
}

export function FinanceMetrics({ dateRange }: Props) {
  const [data, setData] = useState<FinanceMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const toLocalDate = (d: Date) => {
        const y  = d.getFullYear();
        const m  = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dd}`;
      };
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", toLocalDate(dateRange.from));
      if (dateRange?.to)   params.set("to",   toLocalDate(dateRange.to));
      const qs = params.size > 0 ? `?${params}` : "";
      const res = await fetch(`/api/finance/metrics${qs}`, { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        title="Venituri Încasate"
        icon={CheckCircle2}
        iconClass="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        total={data?.incasate.total ?? 0}
        count={data?.incasate.count ?? 0}
        pctTotal={data?.incasate.pctTotal ?? null}
        loading={loading}
      />
      <MetricCard
        title="Facturi Stornate"
        icon={RotateCcw}
        iconClass="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        total={data?.stornate.total ?? 0}
        count={data?.stornate.count ?? 0}
        pctTotal={data?.stornate.pctTotal ?? null}
        inverseColor={true}
        loading={loading}
      />
      <MetricCard
        title="De Încasat"
        icon={Clock}
        iconClass="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
        total={data?.emise.total ?? 0}
        count={data?.emise.count ?? 0}
        pctTotal={data?.emise.pctTotal ?? null}
        loading={loading}
      />
    </div>
  );
}
