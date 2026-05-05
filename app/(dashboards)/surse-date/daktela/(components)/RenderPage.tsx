"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { Phone, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Call {
  id:          string;
  callerPhone: string;
  direction:   string | null;
  status:      string | null;
  duration:    number | null;
  campaign:    string | null;
  queue:       string | null;
  startedAt:   string;
  agent:       { name: string } | null;
  lead:        { fullName: string | null; source: string | null } | null;
}
interface CallsResponse { calls: Call[]; total: number; answered: number }

const fmtDuration = (sec: number | null) => {
  if (!sec) return "—";
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function RenderPage() {
  const defaultDateRange = (): DateTimeRange => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  };
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(defaultDateRange);
  const [data, setData]           = useState<CallsResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState(false);
  const [syncMsg, setSyncMsg]     = useState<string | null>(null);
  const hasCreds = !!(process.env.NEXT_PUBLIC_DAKTELA_CONNECTED); // flag opțional

  const from = dateRange?.from?.toISOString().slice(0, 10);
  const to   = dateRange?.to?.toISOString().slice(0, 10);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to)   params.set("to", to);
    fetch(`/api/daktela/calls?${params}&limit=200`, { cache: "no-store" })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, [from, to]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    const res  = await fetch("/api/daktela/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ from, to }) });
    const json = await res.json() as { ok?: boolean; created?: number; skipped?: number; error?: string };
    setSyncMsg(json.ok ? `Sync reușit: ${json.created} apeluri noi, ${json.skipped} existente` : (json.error ?? "Eroare sync"));
    setSyncing(false);
    load();
  };

  const answerRate = data && data.total > 0 ? Math.round((data.answered / data.total) * 100) : 0;

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Daktela"
        subtitle="Integrare call center Daktela v5 — apeluri, agenți, lead-uri"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Surse de date" },
          { label: "Daktela" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Status banner */}
      {!hasCreds && (
        <Card className="shadow-xs border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-4 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
            <p className="font-semibold">Daktela nu este conectat</p>
            <p>Adaugă variabilele <code className="bg-muted px-1 rounded text-xs">DAKTELA_API_URL</code> și <code className="bg-muted px-1 rounded text-xs">DAKTELA_API_TOKEN</code> în Vercel Environment Variables.</p>
            <p className="text-xs">Webhook disponibil la: <code className="bg-muted px-1 rounded">/api/webhooks/daktela</code></p>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total apeluri",        value: String(data?.total ?? 0) },
          { label: "Receptionate",         value: String(data?.answered ?? 0) },
          { label: "Rată răspuns",         value: `${answerRate}%` },
          { label: "Missed",               value: String((data?.total ?? 0) - (data?.answered ?? 0)) },
        ].map(m => (
          <Card key={m.label} className="shadow-xs">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="text-2xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calls table */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" /> Apeluri Daktela</CardTitle>
              <CardDescription className="text-xs">{data?.total ?? 0} apeluri în perioada selectată</CardDescription>
            </div>
            <div className="flex gap-2">
              <button onClick={load} className="flex items-center gap-1 border rounded px-3 py-1.5 text-sm hover:bg-muted">
                <RefreshCw className="h-3.5 w-3.5" /> Reîncarcă
              </button>
              <button onClick={handleSync} disabled={syncing} className="bg-primary text-primary-foreground rounded px-3 py-1.5 text-sm hover:bg-primary/90">
                {syncing ? "Sync..." : "Sync Daktela API"}
              </button>
            </div>
          </div>
          {syncMsg && (
            <div className={`mt-2 text-xs px-3 py-2 rounded ${syncMsg.includes("reușit") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {syncMsg}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">Se încarcă apelurile...</div>
          ) : !data || data.calls.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
              Niciun apel Daktela. Apasă &quot;Sync Daktela API&quot; pentru a importa.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {["Data", "Apelant", "Direcție", "Status", "Durată", "Agent", "Campanie", "Lead"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.calls.map(call => (
                    <tr key={call.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">{new Date(call.startedAt).toLocaleString("ro-RO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="px-4 py-2.5 font-medium">{call.callerPhone}</td>
                      <td className="px-4 py-2.5 text-muted-foreground capitalize">{call.direction ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${call.status === "Answered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {call.status ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{fmtDuration(call.duration)}</td>
                      <td className="px-4 py-2.5">{call.agent?.name ?? "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{call.campaign ?? "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{call.lead?.fullName ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
