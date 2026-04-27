"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MousePointerClick, Eye, Banknote, Target, RefreshCw, Link } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Overview {
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  costPerConversion: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  channelType: string;
  biddingStrategy: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  costPerConversion: number;
  videoViews: number;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format(v);

const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);

const fmtPct = (v: number) => `${v.toFixed(2)}%`;

function statusColor(s: string) {
  switch (s) {
    case "ENABLED":  return "bg-green-50 text-green-700 border-green-200";
    case "PAUSED":   return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "REMOVED":  return "bg-red-50 text-red-700 border-red-200";
    default:         return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function statusLabel(s: string) {
  switch (s) {
    case "ENABLED": return "Activ";
    case "PAUSED":  return "Pauzat";
    case "REMOVED": return "Șters";
    default:        return s;
  }
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon, sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <Card className="shadow-xs">
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Not connected state ──────────────────────────────────────────────────────

function NotConnected() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
            <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
            <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
            <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          Google Ads — Conectare necesară
        </CardTitle>
        <CardDescription>
          Autorizează accesul la contul tău Google Ads pentru a vedea date reale.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <a href="/api/auth/google-ads">
            <Link className="h-4 w-4 mr-2" />
            Conectează contul Google Ads
          </a>
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Vei fi redirecționat către Google pentru a autoriza accesul. Procesul durează ~1 minut.
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RenderPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(),
  });

  const [overview, setOverview] = useState<Overview | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [notConnected, setNotConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toLocal = (d: Date) => d.toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", toLocal(dateRange.from));
      if (dateRange?.to)   params.set("to",   toLocal(dateRange.to));
      const res = await fetch(`/api/google-ads/campaigns?${params}`, { cache: "no-store" });
      const data = await res.json() as {
        error?: string;
        overview?: Overview;
        campaigns?: Campaign[];
      };
      if (data.error === "not_connected") {
        setNotConnected(true);
      } else if (data.error) {
        setError(data.error);
      } else {
        setOverview(data.overview ?? null);
        setCampaigns(data.campaigns ?? []);
        setNotConnected(false);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Google Ads"
        subtitle="Performanță campanii, conversii și costuri în timp real."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Canale Marketing", href: "/education" },
          { label: "Google Ads" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {notConnected && <NotConnected />}

      {!notConnected && error && (
        <Card className="shadow-xs border-red-200">
          <CardContent className="pt-4">
            <p className="text-sm text-red-600 font-medium">Eroare API:</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={load}>
              <RefreshCw className="h-3 w-3 mr-2" /> Reîncearcă
            </Button>
          </CardContent>
        </Card>
      )}

      {!notConnected && !error && (
        <>
          {/* KPI Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <KpiCard label="Impresii"        value={loading ? "—" : fmtNum(overview?.impressions ?? 0)}     icon={<Eye className="h-4 w-4" />} />
            <KpiCard label="Clickuri"        value={loading ? "—" : fmtNum(overview?.clicks ?? 0)}         icon={<MousePointerClick className="h-4 w-4" />} />
            <KpiCard label="CTR"             value={loading ? "—" : fmtPct(overview?.ctr ?? 0)}            icon={<TrendingUp className="h-4 w-4" />} />
            <KpiCard label="Cost Total"      value={loading ? "—" : fmtRON(overview?.spend ?? 0)}          icon={<Banknote className="h-4 w-4" />} />
            <KpiCard label="CPC Mediu"       value={loading ? "—" : fmtRON(overview?.avgCpc ?? 0)}         icon={<TrendingDown className="h-4 w-4" />} />
            <KpiCard label="Conversii"       value={loading ? "—" : fmtNum(overview?.conversions ?? 0)}    icon={<Target className="h-4 w-4" />} />
            <KpiCard label="Cost/Conversie"  value={loading ? "—" : fmtRON(overview?.costPerConversion ?? 0)} icon={<Target className="h-4 w-4" />} />
          </div>

          {/* Campaigns table */}
          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Campanii Google Ads</CardTitle>
                  <CardDescription className="text-xs">Date din contul RoCereal Sibiu</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
                  <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                  Se încarcă...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                  Nu există campanii pentru intervalul selectat.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        {["Campanie", "Status", "Tip", "Impresii", "Clickuri", "CTR", "Cost", "CPC", "Conversii", "Cost/Conv."].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c) => (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 font-medium max-w-[220px] truncate">{c.name}</td>
                          <td className="px-4 py-2.5">
                            <Badge variant="outline" className={statusColor(c.status)}>
                              {statusLabel(c.status)}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                            {c.channelType?.replace("_", " ") ?? "—"}
                          </td>
                          <td className="px-4 py-2.5">{fmtNum(c.impressions)}</td>
                          <td className="px-4 py-2.5">{fmtNum(c.clicks)}</td>
                          <td className="px-4 py-2.5">{fmtPct(c.ctr)}</td>
                          <td className="px-4 py-2.5 font-semibold text-green-600">{fmtRON(c.spend)}</td>
                          <td className="px-4 py-2.5">{fmtRON(c.avgCpc)}</td>
                          <td className="px-4 py-2.5">{fmtNum(c.conversions)}</td>
                          <td className="px-4 py-2.5">{c.costPerConversion > 0 ? fmtRON(c.costPerConversion) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
