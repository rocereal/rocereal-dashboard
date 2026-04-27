"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profitabilitateCanalData } from "@/data/financiar-data";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PROFIT_COLOR = "#22c55e";
const COST_COLOR   = "#3b82f6";
const ROAS_COLOR   = "#1e293b";

function fmtLei(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v}`;
}

function BarLabel({ x, y, width, value, color, compact }: {
  x?: number; y?: number; width?: number; value?: number; color?: string; compact?: boolean;
}) {
  if (!value || !x || !y || !width) return null;
  const label = compact
    ? `${Math.round(value / 1000)}K`
    : `${value.toLocaleString("ro-RO")} lei`;
  return (
    <text x={x + width / 2} y={y - 4} textAnchor="middle" fontSize={compact ? 9 : 11} fill={color ?? "#374151"} fontWeight={500}>
      {label}
    </text>
  );
}

function RoasLabel({ x, y, value, compact }: { x?: number; y?: number; value?: number; compact?: boolean }) {
  if (!value || !x || !y) return null;
  return (
    <text x={x} y={y - 8} textAnchor="middle" fontSize={compact ? 9 : 11} fill={ROAS_COLOR} fontWeight={600}>
      {`${value}x`}
    </text>
  );
}

interface ChannelProfitRow {
  canal: string;
  profitBrut: number;
  cost: number;
  roas: number;
}

export function PrognozaBarChart({ data: dataProp }: { data?: ChannelProfitRow[] }) {
  const data = dataProp ?? profitabilitateCanalData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // compact: hide long labels; tiny: hide all labels
  const compact = containerWidth < 420;
  const tiny    = containerWidth < 280;

  const chartMargin = compact
    ? { top: 18, right: 28, left: -8, bottom: 4 }
    : { top: 24, right: 40, left: 0,  bottom: 4 };

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Profitabilitate pe canal</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 flex-1 flex flex-col justify-center" ref={containerRef}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={chartMargin} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="canal" tick={{ fontSize: compact ? 10 : 12 }} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="lei"
              tickFormatter={fmtLei}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={compact ? 32 : 42}
              label={compact ? undefined : { value: "Lei", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8", dy: 20 }}
            />
            <YAxis
              yAxisId="roas"
              orientation="right"
              tickFormatter={(v) => `${v}`}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={compact ? 24 : 36}
              domain={[0, 8]}
              label={compact ? undefined : { value: "ROAS (x)", angle: 90, position: "insideRight", fontSize: 11, fill: "#94a3b8", dy: -30 }}
            />
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined) => {
                const v = value ?? 0;
                if (name === "roas") return [`${v}x`, "ROAS"] as [string, string];
                return [`${v.toLocaleString("ro-RO")} lei`, name === "profitBrut" ? "Profit brut" : "Cost"] as [string, string];
              }}
            />
            <Legend
              formatter={(value) => {
                if (value === "profitBrut") return "Profit brut (lei)";
                if (value === "cost")       return "Cost (lei)";
                if (value === "roas")       return "ROAS (x)";
                return value;
              }}
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: compact ? 10 : 12, paddingTop: 4 }}
            />
            <Bar yAxisId="lei" dataKey="profitBrut" fill={PROFIT_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48}>
              {!tiny && (
                <LabelList content={(props) =>
                  <BarLabel {...props as { x?: number; y?: number; width?: number; value?: number }} color={PROFIT_COLOR} compact={compact} />
                } />
              )}
            </Bar>
            <Bar yAxisId="lei" dataKey="cost" fill={COST_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48}>
              {!tiny && (
                <LabelList content={(props) =>
                  <BarLabel {...props as { x?: number; y?: number; width?: number; value?: number }} color={COST_COLOR} compact={compact} />
                } />
              )}
            </Bar>
            <Line
              yAxisId="roas"
              type="monotone"
              dataKey="roas"
              stroke={ROAS_COLOR}
              strokeWidth={2}
              dot={{ r: compact ? 3 : 5, fill: ROAS_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            >
              {!tiny && (
                <LabelList content={(props) =>
                  <RoasLabel {...props as { x?: number; y?: number; value?: number }} compact={compact} />
                } />
              )}
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
