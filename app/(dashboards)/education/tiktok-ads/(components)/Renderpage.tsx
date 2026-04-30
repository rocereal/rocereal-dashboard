"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MousePointerClick, TrendingUp, TrendingDown, Banknote, Target, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { TikTokAdsManagerTable } from "./TikTokAdsManagerTable";

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

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format(v);

const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);
const fmtPct = (v: number) => `${v.toFixed(2)}%`;

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

  const [overview, setOverview]           = useState<Overview | null>(null);
  const [loading, setLoading]             = useState(true);
  const [notConnected, setNotConnected]   = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const toISO = (d: Date) => format(d, "yyyy-MM-dd");

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
        reportWarning?: string;
      };
      if (data.error === "not_connected") {
        setNotConnected(true);
      } else if (data.error) {
        setError(data.error);
      } else {
        setOverview(data.overview ?? null);
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
            <KpiCard label="Impresii"       value={loading ? "—" : fmtNum(overview?.impressions ?? 0)}     icon={<Eye className="h-4 w-4" />} />
            <KpiCard label="Clickuri"       value={loading ? "—" : fmtNum(overview?.clicks ?? 0)}          icon={<MousePointerClick className="h-4 w-4" />} />
            <KpiCard label="CTR"            value={loading ? "—" : fmtPct(overview?.ctr ?? 0)}             icon={<TrendingUp className="h-4 w-4" />} />
            <KpiCard label="Cost Total"     value={loading ? "—" : fmtRON(overview?.spend ?? 0)}           icon={<Banknote className="h-4 w-4" />} />
            <KpiCard label="CPC Mediu"      value={loading ? "—" : fmtRON(overview?.avgCpc ?? 0)}          icon={<TrendingDown className="h-4 w-4" />} />
            <KpiCard label="Conversii"      value={loading ? "—" : fmtNum(overview?.conversions ?? 0)}     icon={<Target className="h-4 w-4" />} />
            <KpiCard label="Cost/Conversie" value={loading ? "—" : overview?.costPerConversion ? fmtRON(overview.costPerConversion) : "—"} icon={<Target className="h-4 w-4" />} />
          </div>

          {/* Ads Manager Table */}
          <div className="bg-card rounded-lg border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TikTokLogo />
                  TikTok Ads Manager
                </h3>
                <span className="text-sm text-muted-foreground">Date din contul RoCereal</span>
              </div>
              <TikTokAdsManagerTable dateRange={dateRange} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
