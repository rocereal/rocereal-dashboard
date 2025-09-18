"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface WordCloudProps {
  data: Array<{
    text: string;
    size: number;
    color?: string;
  }>;
  title?: string;
  description?: string;
  className?: string;
}

export function WordCloud({
  data,
  title = "Word Cloud",
  description = "Popular query topics",
  className,
}: WordCloudProps) {
  // Simple word cloud layout - arrange words in a basic grid/cloud pattern
  const getWordStyle = (item: (typeof data)[0], index: number) => {
    const baseSize = Math.max(12, Math.min(item.size, 48));
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#ec4899",
      "#6366f1",
    ];

    return {
      fontSize: `${baseSize}px`,
      color: item.color || colors[index % colors.length],
      fontWeight: item.size > 30 ? "bold" : item.size > 20 ? "600" : "normal",
      opacity: 0.8 + (item.size / 50) * 0.2, // Larger words are more opaque
    };
  };

  return (
    <Card className={`py-0 shadow-xs ${className || ""}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="flex flex-wrap items-center justify-center gap-3 p-6 min-h-[300px] bg-muted/20 rounded-lg">
          {data.map((item, index) => (
            <span
              key={item.text}
              className="transition-all duration-200 hover:scale-110 cursor-pointer select-none"
              style={getWordStyle(item, index)}
              title={`${item.text}: ${item.size} mentions`}
            >
              {item.text}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
