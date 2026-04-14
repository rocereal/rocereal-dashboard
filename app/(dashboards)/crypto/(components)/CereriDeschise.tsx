"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cereriDeschise } from "@/data/financiar-data";
import { FileText } from "lucide-react";

function formatEUR(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K EUR`;
  return `${val} EUR`;
}

export function CereriDeschise() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Cereri deschise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cereriDeschise.map((cerere, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{cerere.data}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {cerere.companie}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-primary flex-shrink-0">
              {formatEUR(cerere.valoare)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
