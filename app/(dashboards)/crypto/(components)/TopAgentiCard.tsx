"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topAgenti } from "@/data/financiar-data";

export function TopAgentiCard() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Top agenti vs target
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topAgenti.map((agent, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {agent.avatar}
              </div>
              <span className="text-sm truncate text-muted-foreground">
                {agent.name}
              </span>
            </div>
            <span
              className={`text-base font-bold flex-shrink-0 ${
                agent.procent >= 100 ? "text-green-600 dark:text-green-400" : "text-orange-500"
              }`}
            >
              {agent.procent}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
