"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DataPoint {
  date: string; // "YYYY-MM"
  cătălin: number;
  valentin: number;
  alteCanale: number;
  total: number;
}

// ─── Chart config ─────────────────────────────────────────────────────────────
const chartConfig: ChartConfig = {
  cătălin:    { label: "Cătălin",      color: "var(--chart-1)" },
  valentin:   { label: "Valentin",     color: "var(--chart-2)" },
  alteCanale: { label: "Alte canale",  color: "var(--chart-3)" },
  total:      { label: "Total",        color: "var(--chart-4)" },
};

const DATA_KEYS = ["cătălin", "valentin", "alteCanale", "total"] as const;
type DataKey = typeof DATA_KEYS[number];

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", {
    style: "currency", currency: "RON", maximumFractionDigits: 0,
  }).format(v);

const fmtMonth = (s: string) => {
  const [y, m] = s.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("ro-RO", { month: "short", year: "numeric" });
};

// ─── Main component ───────────────────────────────────────────────────────────
interface Props {
  dateRange?: DateTimeRange;
}

export function EvolutiaVanzarilor({ dateRange }: Props) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<DataKey>("total");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", dateRange.from.toISOString().slice(0, 10));
      if (dateRange?.to) params.set("to", dateRange.to.toISOString().slice(0, 10));
      const qs = params.size > 0 ? `?${params}` : "";
      const res = await fetch(`/api/finance/sales-by-agent${qs}`, { cache: "no-store" });
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { load(); }, [load]);

  const totals = useMemo(() => {
    const t: Record<DataKey, number> = { cătălin: 0, valentin: 0, alteCanale: 0, total: 0 };
    for (const row of data) {
      t.cătălin    += row.cătălin;
      t.valentin   += row.valentin;
      t.alteCanale += row.alteCanale;
      t.total      += row.total;
    }
    return t;
  }, [data]);

  return (
    <Card className="py-0 shadow-xs">
      {/* Header — same pattern as SampleBarChart */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Evoluția Vânzărilor</CardTitle>
          <CardDescription>
            Facturi încasate din SmartBill, grupate pe agent și lună
          </CardDescription>
        </div>

        {/* Totals / tab buttons */}
        <div className="flex">
          {DATA_KEYS.map((key) => (
            <button
              key={key}
              data-active={activeKey === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveKey(key)}
            >
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {chartConfig[key]?.label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl tabular-nums">
                {loading ? "..." : fmtRON(totals[key])}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Se încarcă...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
            Nu există date pentru intervalul selectat.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={fmtMonth}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[180px]"
                    nameKey={activeKey}
                    labelFormatter={(value) => fmtMonth(value as string)}
                  />
                }
              />
              <Bar
                dataKey={activeKey}
                fill={`var(--color-${activeKey})`}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
