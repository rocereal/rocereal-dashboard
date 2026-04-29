"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MousePointerClick, TrendingUp, TrendingDown, Banknote, Target, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Overview {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  avgCpc: number;
  costPerConversion: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  costPerConversion: number;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format(v);

const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);
const fmtPct = (v: number) => `${v.toFixed(2)}%`;

function statusColor(s: string) {
  if (s === "CAMPAIGN_STATUS_ENABLE" || s === "ENABLE") return "bg-green-50 text-green-700 border-green-200";
  if (s === "CAMPAIGN_STATUS_DISABLE" || s === "DISABLE") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (s === "CAMPAIGN_STATUS_DELETE" || s === "DELETE") return "bg-red-50 text-red-700 border-red-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function statusLabel(s: string) {
  if (s.includes("ENABLE")) return "Activ";
  if (s.includes("DISABLE")) return "Pauzat";
  if (s.includes("DELETE")) return "Șters";
  return s;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon, sub }: { label: string; value: string; icon: React.ReactNode; sub?: string }) {
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

// ─── TikTok Logo ──────────────────────────────────────────────────────────────

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5"}>
      <path fill="#010101" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
}

// ─── Not connected ────────────────────────────────────────────────────────────

function NotConnected() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TikTokLogo />
          TikTok Ads — Conectare necesară
        </CardTitle>
        <CardDescription>
          TIKTOK_ACCESS_TOKEN nu este setat în variabilele de mediu Vercel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Adaugă variabilele de mai jos în Vercel → Settings → Environment Variables, apoi redeploy:
        </p>
        <div className="rounded-md bg-muted/60 px-4 py-3 font-mono text-xs space-y-1">
          <p>TIKTOK_ACCESS_TOKEN = <span className="text-muted-foreground italic">obținut din OAuth flow</span></p>
          <p>TIKTOK_APP_ID = 7633989708837552129</p>
          <p>TIKTOK_ADVERTISER_ID = 7604889645461094417</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/api/auth/tiktok-ads" target="_blank">
            <TikTokLogo className="h-4 w-4 mr-2" />
            Pornește autorizarea TikTok
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const [overview, setOverview]       = useState<Overview | null>(null);
  const [campaigns, setCampaigns]     = useState<Campaign[]>([]);
  const [loading, setLoading]         = useState(true);
  const [notConnected, setNotConnected] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", toISO(dateRange.from));
      if (dateRange?.to)   params.set("to",   toISO(dateRange.to));
      const res  = await fetch(`/api/tiktok-ads/campaigns?${params}`, { cache: "no-store" });
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
        title="TikTok Ads"
        subtitle="Performanță campanii, reach, CPM, CTR și conversii în timp real."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Canale Marketing", href: "/education" },
          { label: "TikTok Ads" },
        ]}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {notConnected && <NotConnected />}

      {!notConnected && error && (
        <Card className="shadow-xs border-red-200">
          <CardContent className="pt-4">
            <p className="text-sm text-red-600 font-medium">Eroare API TikTok:</p>
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
            <KpiCard label="Impresii"       value={loading ? "—" : fmtNum(overview?.impressions ?? 0)}        icon={<Eye className="h-4 w-4" />} />
            <KpiCard label="Clickuri"       value={loading ? "—" : fmtNum(overview?.clicks ?? 0)}            icon={<MousePointerClick className="h-4 w-4" />} />
            <KpiCard label="CTR"            value={loading ? "—" : fmtPct(overview?.ctr ?? 0)}               icon={<TrendingUp className="h-4 w-4" />} />
            <KpiCard label="Cost Total"     value={loading ? "—" : fmtRON(overview?.spend ?? 0)}             icon={<Banknote className="h-4 w-4" />} />
            <KpiCard label="CPC Mediu"      value={loading ? "—" : fmtRON(overview?.avgCpc ?? 0)}            icon={<TrendingDown className="h-4 w-4" />} />
            <KpiCard label="Conversii"      value={loading ? "—" : fmtNum(overview?.conversions ?? 0)}       icon={<Target className="h-4 w-4" />} />
            <KpiCard label="Cost/Conversie" value={loading ? "—" : overview?.costPerConversion ? fmtRON(overview.costPerConversion) : "—"} icon={<Target className="h-4 w-4" />} />
          </div>

          {/* Campaigns table */}
          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Campanii TikTok Ads</CardTitle>
                  <CardDescription className="text-xs">Date din contul RoCereal</CardDescription>
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
                        {["Campanie", "Status", "Obiectiv", "Impresii", "Clickuri", "CTR", "Cost", "CPC", "CPM", "Conversii", "Cost/Conv."].map((h) => (
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
                            {c.objective?.replace(/_/g, " ") ?? "—"}
                          </td>
                          <td className="px-4 py-2.5">{fmtNum(c.impressions)}</td>
                          <td className="px-4 py-2.5">{fmtNum(c.clicks)}</td>
                          <td className="px-4 py-2.5">{fmtPct(c.ctr)}</td>
                          <td className="px-4 py-2.5 font-semibold text-green-600">{fmtRON(c.spend)}</td>
                          <td className="px-4 py-2.5">{fmtRON(c.cpc)}</td>
                          <td className="px-4 py-2.5">{fmtRON(c.cpm)}</td>
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
