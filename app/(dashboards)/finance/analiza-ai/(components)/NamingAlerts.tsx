"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Violation { entityId: string; entityName: string; level: string; platform: string; reason: string }
interface NamingResult { total: number; violations: number; compliant: number; items: Violation[] }

const LEVEL_LABEL: Record<string, string> = { campaign: "Campanie", adset: "Ad Set", ad: "Reclamă" };
const LEVEL_COLOR: Record<string, string> = { campaign: "bg-purple-100 text-purple-700", adset: "bg-blue-100 text-blue-700", ad: "bg-green-100 text-green-700" };

export function NamingAlerts() {
  const [data, setData]       = useState<NamingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/finance/naming-check", { cache: "no-store" })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && data && data.violations === 0) {
    return (
      <Card className="shadow-xs border-green-200 dark:border-green-900">
        <CardContent className="pt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
          <CheckCircle className="h-4 w-4" /> Toate reclamele respectă naming convention.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" /> Naming Convention Violations
        </CardTitle>
        <CardDescription className="text-xs">
          {loading ? "Se verifică..." : `${data?.violations ?? 0} din ${data?.total ?? 0} entități nu respectă convenția ROCE_[CANAL]_[PRODUS]_[OBIECTIV]_[REGIUNE]_[YYYYMM]`}
        </CardDescription>
      </CardHeader>
      {!loading && data && data.violations > 0 && (
        <CardContent className="space-y-2">
          {(expanded ? data.items : data.items.slice(0, 5)).map(v => (
            <div key={v.entityId} className="flex items-start gap-3 text-sm border-b pb-2 last:border-0">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded shrink-0 ${LEVEL_COLOR[v.level] ?? "bg-muted"}`}>
                {LEVEL_LABEL[v.level] ?? v.level}
              </span>
              <div className="min-w-0">
                <p className="font-medium truncate" title={v.entityName}>{v.entityName}</p>
                <p className="text-xs text-muted-foreground">{v.reason}</p>
              </div>
            </div>
          ))}
          {data.items.length > 5 && (
            <button onClick={() => setExpanded(e => !e)} className="text-xs text-primary underline">
              {expanded ? "Arată mai puțin" : `Arată toate ${data.items.length} violations`}
            </button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
