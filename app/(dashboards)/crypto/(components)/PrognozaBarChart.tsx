"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profitabilitateCanalData } from "@/data/financiar-data";
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

// Custom label for bars
function BarLabel({ x, y, width, value, color }: { x?: number; y?: number; width?: number; value?: number; color?: string }) {
  if (!value || !x || !y || !width) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      textAnchor="middle"
      fontSize={11}
      fill={color ?? "#374151"}
      fontWeight={500}
    >
      {`${value.toLocaleString("ro-RO")} lei`}
    </text>
  );
}

// Custom label for ROAS line dots
function RoasLabel({ x, y, value }: { x?: number; y?: number; value?: number }) {
  if (!value || !x || !y) return null;
  return (
    <text x={x} y={y - 10} textAnchor="middle" fontSize={11} fill={ROAS_COLOR} fontWeight={600}>
      {`${value}x`}
    </text>
  );
}

export function PrognozaBarChart() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Profitabilitate pe canal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart
            data={profitabilitateCanalData}
            margin={{ top: 24, right: 40, left: 0, bottom: 4 }}
            barGap={4}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="canal" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="lei"
              tickFormatter={fmtLei}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={42}
              label={{ value: "Lei", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8", dy: 20 }}
            />
            <YAxis
              yAxisId="roas"
              orientation="right"
              tickFormatter={(v) => `${v}`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={36}
              domain={[0, 8]}
              label={{ value: "ROAS (x)", angle: 90, position: "insideRight", fontSize: 11, fill: "#94a3b8", dy: -30 }}
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
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
            />
            <Bar yAxisId="lei" dataKey="profitBrut" fill={PROFIT_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48}>
              <LabelList content={(props) => <BarLabel {...props as { x?: number; y?: number; width?: number; value?: number }} color={PROFIT_COLOR} />} />
            </Bar>
            <Bar yAxisId="lei" dataKey="cost" fill={COST_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48}>
              <LabelList content={(props) => <BarLabel {...props as { x?: number; y?: number; width?: number; value?: number }} color={COST_COLOR} />} />
            </Bar>
            <Line
              yAxisId="roas"
              type="monotone"
              dataKey="roas"
              stroke={ROAS_COLOR}
              strokeWidth={2}
              dot={{ r: 5, fill: ROAS_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            >
              <LabelList content={(props) => <RoasLabel {...props as { x?: number; y?: number; value?: number }} />} />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
