"use client";

import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { PageContext } from "@/app/api/ai/analyze-page/route";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsightResult {
  title:    string;
  body:     string;
  priority: "high" | "medium" | "low";
  category: string;
  action:   string | null;
}

interface EmployeeResult {
  id:          string;
  name:        string;
  title:       string;
  skills:      string[];
  avatarColor: string;
  insights:    InsightResult[];
  error?:      string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACTION_COLOR: Record<string, string> = {
  scale:       "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  stop:        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  test:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  investigate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  monitor:     "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const PRIORITY_DOT: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-yellow-500",
  low:    "bg-green-500",
};

const ACTION_LABEL: Record<string, string> = {
  scale: "Scalează", stop: "Oprește", test: "Testează",
  investigate: "Investighează", monitor: "Monitorizează",
};

// ─── EmployeeCard ─────────────────────────────────────────────────────────────

function EmployeeCard({ emp }: { emp: EmployeeResult }) {
  const initials = emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: emp.avatarColor }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold">{emp.name}</CardTitle>
            <CardDescription className="text-xs">{emp.title}</CardDescription>
            <div className="flex flex-wrap gap-1 mt-1">
              {emp.skills.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {emp.error ? (
          <p className="text-xs text-red-500 italic">{emp.error}</p>
        ) : emp.insights.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Niciun insight generat.</p>
        ) : (
          emp.insights.map((ins, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[ins.priority] ?? "bg-gray-400"}`} />
                  <p className="text-xs font-semibold">{ins.title}</p>
                </div>
                {ins.action && ins.action !== "null" && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${ACTION_COLOR[ins.action] ?? "bg-muted"}`}>
                    {ACTION_LABEL[ins.action] ?? ins.action}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AiPageAnalysis({ context, disabled }: { context: PageContext; disabled?: boolean }) {
  const [results, setResults] = useState<EmployeeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const hasRun = useRef(false);

  const analyze = async (ctx: PageContext) => {
    setLoading(true);
    try {
      const res  = await fetch("/api/ai/analyze-page", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(ctx),
      });
      const data = await res.json() as EmployeeResult[];
      if (Array.isArray(data)) { setResults(data); setLastRun(new Date()); }
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger once when page data finishes loading
  useEffect(() => {
    if (disabled) return;
    if (hasRun.current) return;
    hasRun.current = true;
    analyze(context);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold">Echipa AI — 7 Angajați</h2>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        {lastRun && !loading && (
          <span className="text-xs text-muted-foreground">
            Generat la {lastRun.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {loading ? (
        <div className="border rounded-lg h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Se generează analiză pentru 7 angajați AI...</p>
          <p className="text-xs opacity-60">~15–20 secunde</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map(emp => <EmployeeCard key={emp.id} emp={emp} />)}
        </div>
      ) : disabled ? (
        <div className="border rounded-lg h-24 flex items-center justify-center text-sm text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Se încarcă datele paginii...
        </div>
      ) : null}
    </div>
  );
}
