"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

const RADIAN = Math.PI / 180;

function renderNeedle(
  value: number,
  cx: number,
  cy: number,
  iR: number,
  color: string
) {
  const ang = 180 - (value / 100) * 180;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 6;
  const length = iR - 8;
  const xba = cx + r * sin;
  const yba = cy - r * cos;
  const xbb = cx - r * sin;
  const ybb = cy + r * cos;
  const xp = cx + length * cos;
  const yp = cy + length * sin;

  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="none" />
      <path
        d={`M ${xba} ${yba} L ${xp} ${yp} L ${xbb} ${ybb}`}
        fill={color}
        stroke="none"
      />
    </>
  );
}

interface GaugeCardProps {
  value?: number;
  label?: string;
  sublabel?: string;
}

export function GaugeCard({
  value = 36,
  label = "Prognoze luna aceasta",
  sublabel = "ponderat",
}: GaugeCardProps) {
  const cx = 130;
  const cy = 120;
  const iR = 70;
  const oR = 95;

  const data = [
    { value: value, fill: "var(--chart-1)" },
    { value: 100 - value, fill: "var(--muted)" },
  ];

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold">
          Top agenti vs target
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-2">
        <p className="text-xs text-muted-foreground mb-1">
          {label} — {sublabel}
        </p>
        <div className="relative">
          <PieChart width={260} height={150}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            {renderNeedle(value, cx, cy, iR, "hsl(var(--foreground))")}
          </PieChart>
          <div
            className="absolute text-2xl font-bold"
            style={{
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-chart-1" style={{ color: "var(--chart-1)" }}>
              {value}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
