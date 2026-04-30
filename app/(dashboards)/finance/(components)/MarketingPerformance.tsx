"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar, CartesianGrid, Cell, ComposedChart, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Banknote, Eye, Target, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { PrognozaBarChart } from "@/app/(dashboards)/crypto/(components)/PrognozaBarChart";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChannelStats {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  conversions: number;
}

interface ChannelAttribution {
  conversions: number;
  revenue: number;
}

interface AttributionData {
  facebook: ChannelAttribution;
  tiktok:   ChannelAttribution;
  google:   ChannelAttribution;
}

interface LiveData {
  google:       ChannelStats;
  facebook:     ChannelStats;
  tiktok:       ChannelStats;
  totalRevenue: number;
  attribution:  AttributionData;
  callStats: {
    total: number; answered: number;
    channels:         { facebook: number; tiktok: number; google: number };
    channelsAnswered: { facebook: number; tiktok: number; google: number };
  };
  loading:      boolean;
}

const ZERO: ChannelStats = { spend: 0, impressions: 0, reach: 0, clicks: 0, conversions: 0 };
const ZERO_ATTR: ChannelAttribution = { conversions: 0, revenue: 0 };
const INIT: LiveData = {
  google: ZERO, facebook: ZERO, tiktok: ZERO, totalRevenue: 0,
  attribution: { facebook: ZERO_ATTR, tiktok: ZERO_ATTR, google: ZERO_ATTR },
  callStats: { total: 0, answered: 0, channels: { facebook: 0, tiktok: 0, google: 0 }, channelsAnswered: { facebook: 0, tiktok: 0, google: 0 } },
  loading: true,
};

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

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);

const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);

const fmtK = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ctrPct = (ch: ChannelStats) =>
  ch.impressions > 0 ? `${((ch.clicks / ch.impressions) * 100).toFixed(2)}%` : "—";


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

function FunnelGeneral({ data, loading, totalSpend, answeredCalls, attrConversions }: {
  data: FunnelRow[];
  loading: boolean;
  totalSpend: number;
  answeredCalls: number;
  attrConversions: number;
}) {
  const totalH = data.length * BAND_H + (data.length - 1) * PCT_H;
  const convRate  = answeredCalls > 0
    ? `${((attrConversions / answeredCalls) * 100).toFixed(1)}%`
    : "—";
  const costPerCall = answeredCalls > 0
    ? fmtRON(totalSpend / answeredCalls)
    : "—";

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
                <p className="text-xs text-muted-foreground">Rata de conversie</p>
                <p className="text-sm font-bold">{convRate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Cost / Apel Receptionat</p>
                <p className="text-sm font-bold">{costPerCall}</p>
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
  reach: number;
  clicks: number;
  ctr: string;
  calls: number;
  costPerCall: number | null;
  conversions: number;
  venituri: number;
  roas: number | null;
  live: boolean;
}

function PerformantaTable({ rows, loading }: { rows: PerfRow[]; loading: boolean }) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performanță și Profitabilitate pe Canal</CardTitle>
        <CardDescription className="text-xs">
          Conversii = apeluri răspunse (Invox) cu factură achitată asociată (SmartBill) · Venituri = suma facturilor atribuite
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Canal", "Investiție", "Vizualizări", "Clicuri", "Rată click", "Apeluri generate", "Cost / Apel", "Conversii Atribuite", "Venituri Atribuite", "ROAS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-muted-foreground">Se încarcă...</td>
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
                    <td className="px-4 py-2.5">{row.reach > 0 ? fmtNum(row.reach) : "—"}</td>
                    <td className="px-4 py-2.5">{row.clicks > 0 ? fmtNum(row.clicks) : "—"}</td>
                    <td className="px-4 py-2.5">{row.ctr}</td>
                    <td className="px-4 py-2.5">{row.calls > 0 ? fmtNum(row.calls) : "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.costPerCall !== null ? fmtRON(row.costPerCall) : "—"}</td>
                    <td className="px-4 py-2.5 font-semibold">{row.conversions > 0 ? fmtNum(row.conversions) : "—"}</td>
                    <td className="px-4 py-2.5 font-medium text-green-700 dark:text-green-400">{row.venituri > 0 ? fmtRON(row.venituri) : "—"}</td>
                    <td className="px-4 py-2.5">
                      {row.roas !== null && row.roas > 0 ? (
                        <span className={`font-semibold ${row.roas >= 10 ? "text-green-600" : row.roas >= 5 ? "text-yellow-600" : "text-red-500"}`}>
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
  const { google, facebook, tiktok, attribution, loading } = liveData;
  const totalSpend = google.spend + facebook.spend + tiktok.spend;
  const totalReach = google.reach + facebook.reach + tiktok.reach;
  const attrConversions =
    attribution.facebook.conversions + attribution.tiktok.conversions + attribution.google.conversions;

  const channelRoasValues = [
    facebook.spend > 0 && attribution.facebook.revenue > 0 ? attribution.facebook.revenue / facebook.spend : null,
    google.spend   > 0 && attribution.google.revenue   > 0 ? attribution.google.revenue   / google.spend   : null,
    tiktok.spend   > 0 && attribution.tiktok.revenue   > 0 ? attribution.tiktok.revenue   / tiktok.spend   : null,
  ].filter((v): v is number => v !== null);
  const avgAttrROAS  = channelRoasValues.length > 0 ? channelRoasValues.reduce((s, v) => s + v, 0) / channelRoasValues.length : 0;
  const bestAttrROAS = channelRoasValues.length > 0 ? Math.max(...channelRoasValues) : 0;

  const kpis: { label: string; value: string; sub: string; icon: React.ReactNode }[] = [
    { label: "Facebook",          value: loading ? "—" : fmtRON(facebook.spend), sub: "Investiție",              icon: <ChannelLogo k="facebook" /> },
    { label: "Google",            value: loading ? "—" : fmtRON(google.spend),   sub: "Investiție",              icon: <ChannelLogo k="google" /> },
    { label: "TikTok",            value: loading ? "—" : tiktok.spend > 0 ? fmtRON(tiktok.spend) : "N/A", sub: tiktok.spend > 0 ? "Investiție" : "Neconectat", icon: <ChannelLogo k="tiktok" /> },
    { label: "Total Investiție",  value: loading ? "—" : fmtRON(totalSpend),     sub: "Toate canalele",          icon: <Banknote className="h-6 w-6 text-muted-foreground" /> },
    { label: "Vizualizări Total", value: loading ? "—" : fmtK(totalReach),       sub: "Reach unic agregat",      icon: <Eye     className="h-6 w-6 text-muted-foreground" /> },
    { label: "Conversii Total",   value: loading ? "—" : fmtNum(attrConversions), sub: "Atribuite Invox→SmartBill", icon: <Target  className="h-6 w-6 text-muted-foreground" /> },
    { label: "ROAS Mediu",        value: loading || avgAttrROAS === 0 ? "—" : `${avgAttrROAS.toFixed(2)}x`, sub: bestAttrROAS > 0 ? `Best: ${bestAttrROAS.toFixed(2)}x` : "—", icon: <TrendingUp className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="shadow-xs">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="mb-1.5">{kpi.icon}</div>
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

// Static monthly ad investment estimates (updated manually; real-time per-month
// platform spend would require 36+ API calls and is not fetched dynamically)
const STATIC_INVESTMENT: (number | null)[] = [21400, 19800, 23600, 24750, null, null, null, null, null, null, null, null];

function TrendProfitChart({ dateRange }: { dateRange?: DateTimeRange }) {
  const [chartData, setChartData] = useState<{ luna: string; venituriIncasate: number | null; investitie: number | null }[]>(
    trendData.map((d) => ({ ...d }))
  );
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const year = dateRange?.from
      ? new Date(dateRange.from).getFullYear()
      : new Date().getFullYear();

    setChartLoading(true);
    fetch(`/api/finance/trend?year=${year}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((rows: { luna: string; venituriIncasate: number | null }[]) => {
        setChartData(rows.map((r, i) => ({ ...r, investitie: STATIC_INVESTMENT[i] ?? null })));
      })
      .catch(() => {/* keep static data on error */})
      .finally(() => setChartLoading(false));
  }, [dateRange]);

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Trend – Venituri Încasate vs Investiție Ads</CardTitle>
        <CardDescription className="text-xs">Evoluție lunară — bare: Venituri Încasate (SmartBill) · linie: Investiție Ads (estimat)</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        {chartLoading ? (
          <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">Se încarcă...</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ left: 8, right: 8 }}>
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
        )}
      </CardContent>
    </Card>
  );
}

// ─── TOP AGENȚI ───────────────────────────────────────────────────────────────

interface AgentRow {
  name: string;
  callsTotal: number;
  callsAnswered: number;
  avgDurationSec: number;
  revenue: number;
  conversions: number;
  conversionRate: number;
}

function fmtDuration(sec: number): string {
  if (sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function TopAgentiTable({ dateRange }: { dateRange?: DateTimeRange }) {
  const [agents, setAgents]   = useState<AgentRow[]>([]);
  const [agLoading, setAgLoading] = useState(true);

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;
    setAgLoading(true);
    const from = format(dateRange.from, "yyyy-MM-dd");
    const to   = format(dateRange.to,   "yyyy-MM-dd");
    fetch(`/api/finance/agent-stats?from=${from}&to=${to}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAgents(data); })
      .catch(() => {})
      .finally(() => setAgLoading(false));
  }, [dateRange]);

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performanță Agenți</CardTitle>
        <CardDescription className="text-xs">Apeluri, durată medie, conversii și venituri atribuite per agent · perioadă selectată</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["#", "Agent", "Apeluri", "Răspunse", "Durată medie", "Conversii", "Rată conversie", "Venituri Atribuite"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agLoading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">Se încarcă...</td></tr>
              ) : agents.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">Nicio dată disponibilă</td></tr>
              ) : agents.map((a, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-muted-foreground font-medium">{i + 1}</td>
                  <td className="px-4 py-2.5 font-semibold whitespace-nowrap">{a.name}</td>
                  <td className="px-4 py-2.5">{fmtNum(a.callsTotal)}</td>
                  <td className="px-4 py-2.5">{fmtNum(a.callsAnswered)}</td>
                  <td className="px-4 py-2.5">{fmtDuration(a.avgDurationSec)}</td>
                  <td className="px-4 py-2.5 font-semibold">{a.conversions > 0 ? fmtNum(a.conversions) : "—"}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-medium ${a.conversionRate >= 30 ? "text-green-600" : a.conversionRate >= 15 ? "text-yellow-600" : "text-muted-foreground"}`}>
                      {a.conversionRate > 0 ? `${a.conversionRate}%` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-green-700 dark:text-green-400">{a.revenue > 0 ? fmtRON(a.revenue) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

    const [gRes, fbRes, finRes, ttRes, attrRes, callsRes] = await Promise.allSettled([
      fetch(`/api/google-ads/campaigns?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/finance/metrics?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/finance/attribution?from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/crm/calls?counts=1&from=${from}&to=${to}`, { cache: "no-store" }).then((r) => r.json()),
    ]);

    // Google Ads
    const gData  = gRes.status  === "fulfilled" ? gRes.value  : null;
    const google: ChannelStats = {
      spend:       gData?.overview?.spend       ?? 0,
      impressions: gData?.overview?.impressions ?? 0,
      reach:       gData?.overview?.impressions ?? 0, // Google Ads nu are reach separat
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
      reach:       fbRows.reduce((s, r) => s + (Number(r.reach)       || 0), 0),
      clicks:      fbRows.reduce((s, r) => s + (Number(r.clicks)      || 0), 0),
      conversions: fbRows.reduce((s, r) => s + (Number(r.conversions) || 0), 0),
    };

    // TikTok Ads
    const ttData = ttRes.status === "fulfilled" && !ttRes.value?.error ? ttRes.value : null;
    const tiktok: ChannelStats = {
      spend:       ttData?.overview?.spend       ?? 0,
      impressions: ttData?.overview?.impressions ?? 0,
      reach:       ttData?.overview?.reach       ?? ttData?.overview?.impressions ?? 0,
      clicks:      ttData?.overview?.clicks      ?? 0,
      conversions: ttData?.overview?.conversions ?? 0,
    };

    // Finance metrics → total revenue
    const finData = finRes.status === "fulfilled" ? finRes.value : null;
    const totalRevenue: number = finData?.incasate?.total ?? 0;

    // Attribution (Invox calls → SmartBill invoices)
    const attrRaw = attrRes.status === "fulfilled" && !attrRes.value?.error ? attrRes.value : null;
    const attribution: AttributionData = {
      facebook: { conversions: attrRaw?.facebook?.conversions ?? 0, revenue: attrRaw?.facebook?.revenue ?? 0 },
      tiktok:   { conversions: attrRaw?.tiktok?.conversions   ?? 0, revenue: attrRaw?.tiktok?.revenue   ?? 0 },
      google:   { conversions: attrRaw?.google?.conversions   ?? 0, revenue: attrRaw?.google?.revenue   ?? 0 },
    };

    // Invox call counts for funnel + per-channel breakdown
    const callsRaw = callsRes.status === "fulfilled" && !callsRes.value?.error ? callsRes.value : null;
    const callStats = {
      total:    callsRaw?.total    ?? 0,
      answered: callsRaw?.answered ?? 0,
      channels: {
        facebook: callsRaw?.channels?.facebook ?? 0,
        tiktok:   callsRaw?.channels?.tiktok   ?? 0,
        google:   callsRaw?.channels?.google   ?? 0,
      },
      channelsAnswered: {
        facebook: callsRaw?.channelsAnswered?.facebook ?? 0,
        tiktok:   callsRaw?.channelsAnswered?.tiktok   ?? 0,
        google:   callsRaw?.channelsAnswered?.google   ?? 0,
      },
    };

    setLiveData({ google, facebook, tiktok, totalRevenue, attribution, callStats, loading: false });
  }, [dateRange]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Derived values ─────────────────────────────────────────────────────────
  const { google, facebook, tiktok, attribution, callStats, loading } = liveData;
  const totalReach      = google.reach + facebook.reach + tiktok.reach;
  const attrConversions = attribution.facebook.conversions + attribution.tiktok.conversions + attribution.google.conversions;

  // Funnel — real data from reach / Invox / attribution
  const leadsToReachPct    = totalReach > 0         ? parseFloat(((callStats.total    / totalReach)          * 100).toFixed(2)) : 0;
  const answeredToLeadsPct = callStats.total > 0    ? parseFloat(((callStats.answered / callStats.total)     * 100).toFixed(2)) : 0;
  const salesToAnsweredPct = callStats.answered > 0 ? parseFloat(((attrConversions    / callStats.answered)  * 100).toFixed(2)) : 0;
  const funnelData: FunnelRow[] = [
    { stage: "Reclamă afișată",      value: totalReach,         pct: 100 },
    { stage: "Leads Generate",       value: callStats.total,    pct: leadsToReachPct },
    { stage: "Apeluri receptionate", value: callStats.answered, pct: answeredToLeadsPct },
    { stage: "Vânzări",              value: attrConversions,    pct: salesToAnsweredPct },
  ];

  const attrRoas = (spend: number, revenue: number) =>
    spend > 0 && revenue > 0 ? Math.round((revenue / spend) * 100) / 100 : null;

  // Profitabilitate data — uses attributed revenue from Invox→SmartBill
  const profitData = [
    { canal: "Facebook", profitBrut: attribution.facebook.revenue, cost: facebook.spend, roas: attrRoas(facebook.spend, attribution.facebook.revenue) ?? 0 },
    { canal: "Google",   profitBrut: attribution.google.revenue,   cost: google.spend,   roas: attrRoas(google.spend,   attribution.google.revenue)   ?? 0 },
    { canal: "TikTok",   profitBrut: attribution.tiktok.revenue,   cost: tiktok.spend,   roas: attrRoas(tiktok.spend,   attribution.tiktok.revenue)   ?? 0 },
  ];

  // ROAS donut — attributed ROAS per channel
  const roasData: RoasRow[] = [
    { name: "Facebook", value: attrRoas(facebook.spend, attribution.facebook.revenue) ?? 0, color: "#22c55e" },
    { name: "Google",   value: attrRoas(google.spend,   attribution.google.revenue)   ?? 0, color: "#3b82f6" },
    { name: "TikTok",   value: attrRoas(tiktok.spend,   attribution.tiktok.revenue)   ?? 0, color: "#1e293b" },
  ];

  // Performance table rows — conversions & revenue come from Invox→SmartBill attribution
  const perfRows: PerfRow[] = [
    {
      canal:       "Facebook",
      investitie:  facebook.spend,
      reach:       facebook.reach,
      clicks:      facebook.clicks,
      ctr:         ctrPct(facebook),
      calls:       callStats.channels.facebook,
      costPerCall: callStats.channelsAnswered.facebook > 0 ? Math.round((facebook.spend / callStats.channelsAnswered.facebook) * 100) / 100 : null,
      conversions: attribution.facebook.conversions,
      venituri:    attribution.facebook.revenue,
      roas:        attrRoas(facebook.spend, attribution.facebook.revenue),
      live:        facebook.spend > 0,
    },
    {
      canal:       "Google",
      investitie:  google.spend,
      reach:       google.reach,
      clicks:      google.clicks,
      ctr:         ctrPct(google),
      calls:       callStats.channels.google,
      costPerCall: callStats.channelsAnswered.google > 0 ? Math.round((google.spend / callStats.channelsAnswered.google) * 100) / 100 : null,
      conversions: attribution.google.conversions,
      venituri:    attribution.google.revenue,
      roas:        attrRoas(google.spend, attribution.google.revenue),
      live:        google.spend > 0,
    },
    {
      canal:       "TikTok",
      investitie:  tiktok.spend,
      reach:       tiktok.reach,
      clicks:      tiktok.clicks,
      ctr:         ctrPct(tiktok),
      calls:       callStats.channels.tiktok,
      costPerCall: callStats.channelsAnswered.tiktok > 0 ? Math.round((tiktok.spend / callStats.channelsAnswered.tiktok) * 100) / 100 : null,
      conversions: attribution.tiktok.conversions,
      venituri:    attribution.tiktok.revenue,
      roas:        attrRoas(tiktok.spend, attribution.tiktok.revenue),
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
          <FunnelGeneral
            data={funnelData}
            loading={loading}
            totalSpend={google.spend + facebook.spend + tiktok.spend}
            answeredCalls={callStats.answered}
            attrConversions={attrConversions}
          />
        </div>
        <div className="md:col-span-1 lg:col-span-2 h-full">
          <ROIPeCanal data={roasData} loading={loading} />
        </div>
      </div>

      {/* 3. Performance table */}
      <PerformantaTable rows={perfRows} loading={loading} />

      {/* 4. Trend chart — full width */}
      <TrendProfitChart dateRange={dateRange} />

      {/* 5. Top agents */}
      <TopAgentiTable dateRange={dateRange} />
    </div>
  );
}
