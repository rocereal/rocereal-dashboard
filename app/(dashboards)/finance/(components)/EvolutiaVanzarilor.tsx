"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChartConfig, ChartContainer } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

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

// ─── Date range picker (date-only, no time) ───────────────────────────────────
interface DateRangePickerProps {
  value?: { from?: Date; to?: Date };
  onChange: (range: { from?: Date; to?: Date } | undefined) => void;
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<DateRange | undefined>(value ? { from: value.from, to: value.to } : undefined);

  const handleSelect = (range: DateRange | undefined) => {
    setTemp(range);
    if (range?.from && range?.to) {
      onChange({ from: range.from, to: range.to });
      setOpen(false);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTemp(undefined);
    onChange(undefined);
  };

  const label = value?.from
    ? value.to
      ? `${format(value.from, "dd MMM yyyy", { locale: ro })} — ${format(value.to, "dd MMM yyyy", { locale: ro })}`
      : format(value.from, "dd MMM yyyy", { locale: ro })
    : "Selectează interval de date";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-9 gap-2 text-sm font-normal", !value?.from && "text-muted-foreground")}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span>{label}</span>
          {value?.from && (
            <X
              className="h-3.5 w-3.5 ml-1 text-muted-foreground hover:text-foreground"
              onClick={clear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={temp}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
      <p className="font-medium mb-1.5">{label ? fmtMonth(label) : ""}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{chartConfig[p.name as DataKey]?.label ?? p.name}:</span>
          <span className="font-medium ml-auto pl-4">{fmtRON(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function EvolutiaVanzarilor() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<DataKey>("total");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", dateRange.from.toISOString().slice(0, 10));
      if (dateRange?.to) params.set("to", dateRange.to.toISOString().slice(0, 10));
      const url = `/api/finance/sales-by-agent${params.size > 0 ? `?${params}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
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
      t.cătălin += row.cătălin;
      t.valentin += row.valentin;
      t.alteCanale += row.alteCanale;
      t.total += row.total;
    }
    return t;
  }, [data]);

  return (
    <Card className="py-0 shadow-xs">
      {/* Header with tabs — same pattern as SampleBarChart */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle>Evoluția Vânzărilor</CardTitle>
              <CardDescription className="mt-0.5">
                Facturi incasate din SmartBill, grupate pe agent și lună
              </CardDescription>
            </div>
            {/* Date range picker */}
            <div className="pb-3 sm:pb-0">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </div>

        {/* Totals tabs */}
        <div className="flex overflow-x-auto">
          {DATA_KEYS.map((key) => (
            <button
              key={key}
              data-active={activeKey === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-5 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 sm:py-5 min-w-[100px]"
              onClick={() => setActiveKey(key)}
            >
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {chartConfig[key]?.label}
              </span>
              <span className="text-base leading-none font-bold sm:text-xl tabular-nums">
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ left: 8, right: 8, top: 4, bottom: 0 }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={fmtMonth}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    v >= 1000
                      ? `${(v / 1000).toFixed(0)}k`
                      : String(v)
                  }
                  width={48}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey={activeKey}
                  fill={`var(--color-${activeKey})`}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
