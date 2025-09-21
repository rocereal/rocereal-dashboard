"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface RadarChartProps {
  data: any[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  className?: string;
}

export function RadarChart({
  data,
  title = "Radar Chart",
  description = "Multi-dimensional comparison",
  dataKey = "value",
  nameKey = "name",
  className,
}: RadarChartProps) {
  const size = 200;
  const center = size / 2;
  const maxValue = Math.max(...data.map((item) => item[dataKey]));
  const angleStep = (Math.PI * 2) / data.length;

  // Colors for data points
  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
  ];

  // Calculate points for the radar shape
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const radius = (item[dataKey] / maxValue) * (size * 0.35);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, ...item };
  });

  // Create path for the radar shape
  const pathData =
    points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  return (
    <Card className={`py-0 shadow-xs ${className || ""}`}>
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background circles */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={size * 0.35 * scale}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}

              {/* Axis lines */}
              {data.map((_, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const x2 = center + size * 0.35 * Math.cos(angle);
                const y2 = center + size * 0.35 * Math.sin(angle);
                return (
                  <line
                    key={index}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                );
              })}

              {/* Radar shape */}
              <path
                d={pathData}
                fill={colors[0]}
                fillOpacity="0.2"
                stroke={colors[0]}
                strokeWidth="2"
              />

              {/* Data points */}
              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* Labels */}
            {data.map((item, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const labelRadius = size * 0.42;
              const x = center + labelRadius * Math.cos(angle);
              const y = center + labelRadius * Math.sin(angle);

              return (
                <div
                  key={item[nameKey]}
                  className="absolute text-xs font-medium text-center transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: x,
                    top: y,
                    maxWidth: "60px",
                  }}
                >
                  {item[nameKey]}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
            {data.map((item, index) => (
              <div
                key={item[nameKey]}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                />
                <span className="truncate">{item[nameKey]}</span>
                <span className="ml-auto font-medium">{item[dataKey]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
