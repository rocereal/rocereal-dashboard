"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar, CartesianGrid, Cell, ComposedChart, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { PrognozaBarChart } from "@/app/(dashboards)/crypto/(components)/PrognozaBarChart";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChannelStats {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface LiveData {
  google:       ChannelStats;
  facebook:     ChannelStats;
  tiktok:       ChannelStats;
  totalRevenue: number;
  loading:      boolean;
}

const ZERO: ChannelStats = { spend: 0, impressions: 0, clicks: 0, conversions: 0 };
const INIT: LiveData = { google: ZERO, facebook: ZERO, tiktok: ZERO, totalRevenue: 0, loading: true };

// ─── Static / fallback data ───────────────────────────────────────────────────

// 2026: Ian–Apr = date reale (aproximate), Mai–Dec = dummy
const trendData = [
  { luna: "Ian", venituriIncasate: 520000, investitie: 21400 },
  { luna: "Feb", venituriIncasate: 487000, investitie: 19800 },
  { luna: "Mar", venituriIncasate: 706821, investitie: 23600 },
  { luna: "Apr", venituriIncasate: 271914, investitie: 24750 },
  { luna: "Mai", venituriIncasate: null,   investitie: null },
  { luna: "Iun", venituriIncasate: null,   investitie: null },
  { luna: "Iul", venituriIncasate: null,   investitie: null },
  { luna: "Aug", venituriIncasate: null,   investitie: null },
  { luna: "Sep", venituriIncasate: null,   investitie: null },
  { luna: "Oct", venituriIncasate: null,   investitie: null },
  { luna: "Nov", venituriIncasate: null,   investitie: null },
  { luna: "Dec", venituriIncasate: null,   investitie: null },
];

const topAgenti = [
  { nume: "Mihai Ionescu",   vanzari: 187400, atrib: 24 },
  { nume: "Andra Popescu",   vanzari: 154200, atrib: 19 },
  { nume: "Bogdan Matei",    vanzari: 142800, atrib: 17 },
  { nume: "Cristina Stan",   vanzari: 128600, atrib: 15 },
  { nume: "Vlad Constantin", vanzari: 98300,  atrib: 11 },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);

const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);

const fmtK = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const roas = (ch: ChannelStats, totalRevenue: number) =>
  ch.spend > 0 ? parseFloat((totalRevenue / ch.spend).toFixed(2)) : 0;

const ctrPct = (ch: ChannelStats) =>
  ch.impressions > 0 ? `${((ch.clicks / ch.impressions) * 100).toFixed(2)}%` : "—";

const costPerConv = (ch: ChannelStats) =>
  ch.conversions > 0 ? ch.spend / ch.conversions : 0;

const attrRevenue = (ch: ChannelStats, totalSpend: number, totalRevenue: number) =>
  totalSpend > 0 && ch.spend > 0 ? totalRevenue * (ch.spend / totalSpend) : 0;

const toISO = (d: Date) => format(d, "yyyy-MM-dd");

// ─── Logos ────────────────────────────────────────────────────────────────────

type LogoKey = "facebook" | "google" | "tiktok" | "total" | "calls" | "leads" | "roi";

function ChannelLogo({ k }: { k: LogoKey }) {
  if (k === "facebook") return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#1877f2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.885v2.288h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
  if (k === "google") return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
    </svg>
  );
  if (k === "tiktok") return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path fill="#010101" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
  return <div className="h-6 w-6 rounded bg-muted" />;
}

// ─── FUNNEL ───────────────────────────────────────────────────────────────────

const FUNNEL_STAGES = [
  { tl:  5, tr: 95, bl: 12, br: 88 },
  { tl: 15, tr: 85, bl: 22, br: 78 },
  { tl: 25, tr: 75, bl: 32, br: 68 },
  { tl: 35, tr: 65, bl: 42, br: 58 },
];
const BAND_H = 44;
const PCT_H  = 16;
const COLORS = ["#1877f2", "#22c55e", "#f59e0b", "#ef4444"];

interface FunnelRow { stage: string; value: number; pct: number }

function FunnelGeneral({ data, loading }: { data: FunnelRow[]; loading: boolean }) {
  const totalH = data.length * BAND_H + (data.length - 1) * PCT_H;
  const leads  = data[1]?.value ?? 0;
  const costLead = data[0]?.value > 0 ? "—" : "—"; // would need spend

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Funnel General / Trade Channels</CardTitle>
        <CardDescription className="text-xs">Conversie reclame afișate → vânzări atribuite</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-2 pb-4 flex-1 flex flex-col justify-between">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Se încarcă...</div>
        ) : (
          <>
            <div className="relative w-full" style={{ height: totalH }}>
              {data.map((item, i) => {
                const s = FUNNEL_STAGES[i];
                const topPx = i * (BAND_H + PCT_H);
                return (
                  <div key={item.stage} className="absolute w-full" style={{ top: topPx, height: BAND_H }}>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        clipPath: `polygon(${s.tl}% 0%, ${s.tr}% 0%, ${s.br}% 100%, ${s.bl}% 100%)`,
                        backgroundColor: COLORS[i],
                      }}
                    >
                      <span className="text-white text-xs font-semibold px-2 text-center leading-tight">
                        {fmtK(item.value)} · {item.stage}
                      </span>
                    </div>
                    {i < data.length - 1 && (
                      <div className="absolute w-full flex items-center justify-center" style={{ top: BAND_H, height: PCT_H }}>
                        <span className="text-xs font-medium text-muted-foreground">{item.pct > 0 ? `${item.pct}%` : "—"}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Leads</p>
                <p className="text-sm font-bold">{fmtNum(leads)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Cost / Lead</p>
                <p className="text-sm font-bold">{costLead}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── ROAS DONUT ───────────────────────────────────────────────────────────────

interface RoasRow { name: string; value: number; color: string; [key: string]: unknown }

function ROIPeCanal({ data, loading }: { data: RoasRow[]; loading: boolean }) {
  const visData = data.filter(d => d.value > 0);
  const avgROAS = visData.length > 0
    ? (visData.reduce((s, d) => s + d.value, 0) / visData.length).toFixed(2)
    : "—";

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">ROAS pe Canal</CardTitle>
        <CardDescription className="text-xs">Randamentul investiției per canal</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 gap-3 pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">Se încarcă...</div>
        ) : (
          <>
            <div className="relative flex-shrink-0">
              <PieChart width={130} height={130}>
                <Pie data={visData.length > 0 ? visData : [{ name: "N/A", value: 1, color: "#e2e8f0" }]}
                  cx={60} cy={60} innerRadius={38} outerRadius={58} dataKey="value" stroke="none">
                  {(visData.length > 0 ? visData : [{ color: "#e2e8f0" }]).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number | undefined) => [`${v ?? 0}x`, "ROAS"] as [string, string]}
                  contentStyle={{ fontSize: 12, borderRadius: 6 }}
                />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold leading-none">{avgROAS}{avgROAS !== "—" ? "x" : ""}</span>
                <span className="text-[10px] text-muted-foreground">ROAS mediu</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                  <span className="text-xs font-bold">{item.value > 0 ? `${item.value}x` : "N/A"}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── PERFORMANCE TABLE ────────────────────────────────────────────────────────

interface PerfRow {
  canal: string;
  investitie: number;
  impressions: number;
  clicks: number;
  ctr: string;
  conversions: number;
  costPerConv: number;
  venituri: number;
  roas: number | null;
  live: boolean;
}

function PerformantaTable({ rows, loading }: { rows: PerfRow[]; loading: boolean }) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performanță și Profitabilitate pe Canal</CardTitle>
        <CardDescription className="text-xs">Investiție, impresii și venituri atribuite per canal de marketing</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Canal", "Investiție", "Impresii", "Clicks", "CTR", "Conversii", "Cost/Conv.", "Venituri Atrib.", "ROAS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">Se încarcă...</td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium">
                      <div className="flex items-center gap-1.5">
                        {row.canal}
                        {!row.live && <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">în curând</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.investitie > 0 ? fmtRON(row.investitie) : "—"}</td>
                    <td className="px-4 py-2.5">{row.impressions > 0 ? fmtNum(row.impressions) : "—"}</td>
                    <td className="px-4 py-2.5">{row.clicks > 0 ? fmtNum(row.clicks) : "—"}</td>
                    <td className="px-4 py-2.5">{row.ctr}</td>
                    <td className="px-4 py-2.5">{row.conversions > 0 ? fmtNum(row.conversions) : "—"}</td>
                    <td className="px-4 py-2.5">{row.costPerConv > 0 ? fmtRON(row.costPerConv) : "—"}</td>
                    <td className="px-4 py-2.5 font-medium">{row.venituri > 0 ? fmtRON(row.venituri) : "—"}</td>
                    <td className="px-4 py-2.5">
                      {row.roas !== null && row.roas > 0 ? (
                        <span className={`font-semibold ${row.roas >= 5 ? "text-green-600" : row.roas >= 2 ? "text-yellow-600" : "text-red-500"}`}>
                          {row.roas.toFixed(2)}x
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── KPI CARDS ────────────────────────────────────────────────────────────────

function ChannelKPICards({ liveData }: { liveData: LiveData }) {
  const { google, facebook, tiktok, totalRevenue, loading } = liveData;
  const totalSpend       = google.spend + facebook.spend + tiktok.spend;
  const totalImpressions = google.impressions + facebook.impressions + tiktok.impressions;
  const totalConversions = google.conversions + facebook.conversions + tiktok.conversions;

  const bestROAS = Math.max(
    google.spend > 0 ? totalRevenue / google.spend : 0,
    facebook.spend > 0 ? totalRevenue / facebook.spend : 0,
  );

  const kpis = [
    { label: "Facebook",           value: loading ? "—" : fmtRON(facebook.spend),    sub: "Investiție",        logoKey: "facebook" as LogoKey },
    { label: "Google",             value: loading ? "—" : fmtRON(google.spend),      sub: "Investiție",        logoKey: "google"   as LogoKey },
    { label: "TikTok",             value: loading ? "—" : tiktok.spend > 0 ? fmtRON(tiktok.spend) : "N/A", sub: tiktok.spend > 0 ? "Investiție" : "Neconectat", logoKey: "tiktok" as LogoKey },
    { label: "Total Investiție",   value: loading ? "—" : fmtRON(totalSpend),         sub: "Toate canalele",    logoKey: "total"    as LogoKey },
    { label: "Impresii Total",     value: loading ? "—" : fmtK(totalImpressions),      sub: "Reclame afișate",   logoKey: "calls"    as LogoKey },
    { label: "Conversii Total",    value: loading ? "—" : fmtNum(totalConversions),    sub: "din campanii",      logoKey: "leads"    as LogoKey },
    { label: "ROAS Mediu",         value: loading || totalSpend === 0 ? "—" : `${(totalRevenue / totalSpend).toFixed(2)}x`, sub: bestROAS > 0 ? `Best: ${bestROAS.toFixed(2)}x` : "—", logoKey: "roi" as LogoKey },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="shadow-xs">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="mb-1.5"><ChannelLogo k={kpi.logoKey} /></div>
            <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
            <p className="text-lg font-bold leading-tight mt-0.5">{kpi.value}</p>
            <p className="text-xs text-muted-foreground truncate">{kpi.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── TREND CHART ──────────────────────────────────────────────────────────────

function TrendProfitChart() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Trend – Venituri Încasate vs Investiție Ads</CardTitle>
        <CardDescription className="text-xs">Evoluție lunară 2026 — bare: Venituri Încasate · linie: Total Investiție Ads</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={trendData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="luna" tickLine={false} axisLine={false} tickMargin={8} style={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(v) => fmtK(v)} style={{ fontSize: 11 }} width={48} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(v) => fmtK(v)} style={{ fontSize: 11 }} width={44} />
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined) => [
                value != null ? fmtRON(value) : "—",
                name === "venituriIncasate" ? "Venituri Încasate" : "Investiție Ads",
              ] as [string, string]}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <Bar yAxisId="left" dataKey="venituriIncasate" fill="var(--chart-1)" opacity={0.85} radius={[3, 3, 0, 0]} name="venituriIncasate" />
            <Line yAxisId="right" type="monotone" dataKey="investitie" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} name="investitie" connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ─── TOP AGENȚI ───────────────────────────────────────────────────────────────

function TopAgentiTable() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Agenți după Circuit Atribuite</CardTitle>
        <CardDescription className="text-xs">Luna curentă</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2">#</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2">Agent</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-2">Vânzări</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-2">Circuit</th>
            </tr>
          </thead>
          <tbody>
            {topAgenti.map((a, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-2.5 text-muted-foreground font-medium">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium whitespace-nowrap">{a.nume}</td>
                <td className="px-4 py-2.5 text-right text-green-600 font-semibold">{fmtRON(a.vanzari)}</td>
                <td className="px-4 py-2.5 text-right font-medium">{a.atrib}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function MetricaMica({ label, value, sub, trend }: { label: string; value: string; sub: string; trend: number }) {
  const pos = trend >= 0;
  return (
    <Card className="shadow-xs flex-1">
      <CardContent className="pt-4 pb-3 px-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        <div className={`flex items-center gap-0.5 mt-1 text-xs font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
          {pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {pos ? "+" : ""}{trend}% față de luna trecută
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MarketingPerformance({ dateRange }: { dateRange?: DateTimeRange }) {
  const [liveData, setLiveData] = useState<LiveData>(INIT);

  const fetchAll = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    setLiveData((d) => ({ ...d, loading: true }));

    const from = toISO(dateRange.from);
    const to   = toISO(dateRange.to);

    const [gRes, fbRes, finRes, ttRes] = await Promise.allSettled([
      fetch(`/api/google-ads/campaigns?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/finance/metrics?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
    ]);

    // Google Ads
    const gData  = gRes.status  === "fulfilled" ? gRes.value  : null;
    const google: ChannelStats = {
      spend:       gData?.overview?.spend       ?? 0,
      impressions: gData?.overview?.impressions ?? 0,
      clicks:      gData?.overview?.clicks      ?? 0,
      conversions: gData?.overview?.conversions ?? 0,
    };

    // Facebook Ads — aggregate all campaign rows
    const fbData = fbRes.status === "fulfilled" ? fbRes.value : null;
    const fbRows: Record<string, unknown>[] = Array.isArray(fbData)
      ? fbData
      : (Array.isArray(fbData?.campaigns) ? fbData.campaigns : (Array.isArray(fbData?.data) ? fbData.data : []));
    const facebook: ChannelStats = {
      spend:       fbRows.reduce((s, r) => s + (Number(r.spend)       || 0), 0),
      impressions: fbRows.reduce((s, r) => s + (Number(r.impressions) || 0), 0),
      clicks:      fbRows.reduce((s, r) => s + (Number(r.clicks)      || 0), 0),
      conversions: fbRows.reduce((s, r) => s + (Number(r.conversions) || 0), 0),
    };

    // TikTok Ads
    const ttData = ttRes.status === "fulfilled" && !ttRes.value?.error ? ttRes.value : null;
    const tiktok: ChannelStats = {
      spend:       ttData?.overview?.spend       ?? 0,
      impressions: ttData?.overview?.impressions ?? 0,
      clicks:      ttData?.overview?.clicks      ?? 0,
      conversions: ttData?.overview?.conversions ?? 0,
    };

    // Finance metrics → total revenue
    const finData = finRes.status === "fulfilled" ? finRes.value : null;
    const totalRevenue: number = finData?.incasate?.total ?? 0;

    setLiveData({ google, facebook, tiktok, totalRevenue, loading: false });
  }, [dateRange]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Derived values ─────────────────────────────────────────────────────────
  const { google, facebook, tiktok, totalRevenue, loading } = liveData;
  const totalSpend       = google.spend + facebook.spend + tiktok.spend;
  const totalImpressions = google.impressions + facebook.impressions + tiktok.impressions;
  const totalConversions = google.conversions + facebook.conversions + tiktok.conversions;

  // Funnel: impressions → conversions → estimated offers → estimated sales
  const offers = Math.round(totalConversions * 0.25);
  const sales  = Math.round(offers * 0.20);
  const convPct = totalImpressions > 0
    ? parseFloat(((totalConversions / totalImpressions) * 100).toFixed(2))
    : 0;
  const funnelData: FunnelRow[] = [
    { stage: "Reclamă afișată", value: totalImpressions, pct: 100 },
    { stage: "Leads Generate",  value: totalConversions, pct: convPct },
    { stage: "Oferte Trimise",  value: offers,           pct: totalConversions > 0 ? 25 : 0 },
    { stage: "Vânzări",         value: sales,            pct: offers > 0 ? 20 : 0 },
  ];

  // Profitabilitate data
  const profitData = [
    { canal: "Facebook", profitBrut: totalRevenue, cost: facebook.spend, roas: roas(facebook, totalRevenue) },
    { canal: "Google",   profitBrut: totalRevenue, cost: google.spend,   roas: roas(google, totalRevenue) },
    { canal: "TikTok",   profitBrut: totalRevenue, cost: tiktok.spend,  roas: roas(tiktok, totalRevenue) },
  ];

  // ROAS donut
  const roasData: RoasRow[] = [
    { name: "Facebook", value: roas(facebook, totalRevenue), color: "#22c55e" },
    { name: "Google",   value: roas(google, totalRevenue),   color: "#3b82f6" },
    { name: "TikTok",   value: roas(tiktok, totalRevenue),   color: "#1e293b" },
  ];

  // Performance table rows
  const perfRows: PerfRow[] = [
    {
      canal:       "Facebook",
      investitie:  facebook.spend,
      impressions: facebook.impressions,
      clicks:      facebook.clicks,
      ctr:         ctrPct(facebook),
      conversions: facebook.conversions,
      costPerConv: costPerConv(facebook),
      venituri:    attrRevenue(facebook, totalSpend, totalRevenue),
      roas:        roas(facebook, totalRevenue),
      live:        facebook.spend > 0,
    },
    {
      canal:       "Google",
      investitie:  google.spend,
      impressions: google.impressions,
      clicks:      google.clicks,
      ctr:         ctrPct(google),
      conversions: google.conversions,
      costPerConv: costPerConv(google),
      venituri:    attrRevenue(google, totalSpend, totalRevenue),
      roas:        roas(google, totalRevenue),
      live:        google.spend > 0,
    },
    {
      canal:       "TikTok",
      investitie:  tiktok.spend,
      impressions: tiktok.impressions,
      clicks:      tiktok.clicks,
      ctr:         ctrPct(tiktok),
      conversions: tiktok.conversions,
      costPerConv: costPerConv(tiktok),
      venituri:    attrRevenue(tiktok, totalSpend, totalRevenue),
      roas:        tiktok.spend > 0 ? roas(tiktok, totalRevenue) : null,
      live:        tiktok.spend > 0,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Channel KPI cards */}
      <ChannelKPICards liveData={liveData} />

      {/* 2. Profitabilitate + Funnel + ROI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 items-stretch">
        <div className="md:col-span-2 lg:col-span-4 h-full">
          <PrognozaBarChart data={loading ? undefined : profitData} />
        </div>
        <div className="md:col-span-1 lg:col-span-4 h-full">
          <FunnelGeneral data={funnelData} loading={loading} />
        </div>
        <div className="md:col-span-1 lg:col-span-2 h-full">
          <ROIPeCanal data={roasData} loading={loading} />
        </div>
      </div>

      {/* 3. Performance table */}
      <PerformantaTable rows={perfRows} loading={loading} />

      {/* 4. Trend chart — full width */}
      <TrendProfitChart />

      {/* 5. Top agents */}
      <TopAgentiTable />

      {/* 6. Bottom metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricaMica
          label="Valoare Medie Oferte Atribuite"
          value="8.782 RON"
          sub="per ofertă trimisă"
          trend={+6.4}
        />
        <MetricaMica
          label="Cost Mediu / Atrizare"
          value="56,54 RON"
          sub="per lead atras"
          trend={-4.1}
        />
      </div>
    </div>
  );
}
