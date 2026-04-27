"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar, CartesianGrid, Cell, ComposedChart, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { PrognozaBarChart } from "@/app/(dashboards)/crypto/(components)/PrognozaBarChart";

// ─── Dummy data ────────────────────────────────────────────────────────────────

const channelKPIs = [
  { label: "Facebook",           value: "7.850 RON",  sub: "Investiție",         trend: +12.4, logoKey: "facebook" as const },
  { label: "Google",             value: "6.450 RON",  sub: "Investiție",         trend: -3.1,  logoKey: "google" as const },
  { label: "TikTok",             value: "10.450 RON", sub: "Investiție",         trend: +28.6, logoKey: "tiktok" as const },
  { label: "Total Investiție",   value: "24.750 RON", sub: "Toate canalele",     trend: +8.2,  logoKey: "total" as const },
  { label: "Apeluri Generate",   value: "4.412",      sub: "din campanii",       trend: +5.7,  logoKey: "calls" as const },
  { label: "Sesizări Atribuite", value: "28",         sub: "luna aceasta",       trend: -10.0, logoKey: "leads" as const },
  { label: "Best ROI Canal",     value: "92.060 RON", sub: "Vânzări atribuite",  trend: +18.3, logoKey: "roi" as const },
];

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
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
    </svg>
  );
  // fallback emoji-style for the rest
  const emojis: Record<string, string> = { total: "💰", calls: "📞", leads: "📋", roi: "🏆" };
  return <span className="text-xl">{emojis[k]}</span>;
}

const funnelData = [
  { stage: "Vizitatori Unici", value: 1_434_000, pct: 100 },
  { stage: "Leads Generate",   value: 8_760,     pct: 0.61 },
  { stage: "Oferte Trimise",   value: 2_190,     pct: 25.0 },
  { stage: "Vânzări",          value: 438,       pct: 20.0 },
];

const roiData = [
  { name: "Facebook", value: 3.28, color: "#22c55e" },
  { name: "Google",   value: 4.39, color: "#3b82f6" },
  { name: "TikTok",   value: 3.31, color: "#1e293b" },
];

const performanceRows = [
  {
    canal: "Facebook",    investitie: 7850,  clicks: 42300, ctr: "3.2%",  leads: 1840, costLead: 4.26,
    vanzariAtrib: 312000, vanzariApp: 45000, total: 357000, conversii: "4.2%", roi: 44.5,
  },
  {
    canal: "Google",      investitie: 6450,  clicks: 38100, ctr: "4.1%",  leads: 1560, costLead: 4.13,
    vanzariAtrib: 398000, vanzariApp: 28000, total: 426000, conversii: "5.8%", roi: 65.0,
  },
  {
    canal: "TikTok",      investitie: 10450, clicks: 95400, ctr: "2.1%",  leads: 1240, costLead: 8.43,
    vanzariAtrib: 152000, vanzariApp: 62000, total: 214000, conversii: "1.3%", roi: 19.5,
  },
  {
    canal: "Organic",     investitie: 0,     clicks: 12800, ctr: "—",     leads: 560,  costLead: 0,
    vanzariAtrib: 89000,  vanzariApp: 14000, total: 103000, conversii: "4.4%", roi: null,
  },
  {
    canal: "Email",       investitie: 820,   clicks: 6200,  ctr: "8.7%",  leads: 430,  costLead: 1.91,
    vanzariAtrib: 76000,  vanzariApp: 8000,  total: 84000,  conversii: "6.9%", roi: 101.4,
  },
];

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

const fmtK = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v);

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChannelKPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {channelKPIs.map((kpi) => (
        <Card key={kpi.label} className="shadow-xs">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="mb-1.5"><ChannelLogo k={kpi.logoKey} /></div>
            <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
            <p className="text-lg font-bold leading-tight mt-0.5">{kpi.value}</p>
            <p className="text-xs text-muted-foreground truncate">{kpi.sub}</p>
            <div className={`flex items-center gap-0.5 mt-1 text-xs font-medium ${kpi.trend >= 0 ? "text-green-600" : "text-red-500"}`}>
              {kpi.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {kpi.trend >= 0 ? "+" : ""}{kpi.trend}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Uniform slope: band_change/BAND_H = gap_change/PCT_H → same angle everywhere
// band_change = 7%, gap_change = 7/52*20 ≈ 2.7% → rounded to 3 for clean numbers
// Resulting stages (top-left %, top-right %, bottom-left %, bottom-right %):
const FUNNEL_STAGES = [
  { tl:  0, tr: 100, bl:  7, br: 93 },
  { tl: 10, tr:  90, bl: 17, br: 83 },
  { tl: 20, tr:  80, bl: 27, br: 73 },
  { tl: 30, tr:  70, bl: 37, br: 63 },
];
const BAND_H   = 44; // px height per funnel band
const PCT_H    = 16; // px height for percentage label row between bands
const COLORS   = ["#1877f2", "#22c55e", "#f59e0b", "#ef4444"];

function FunnelGeneral() {
  const totalH = funnelData.length * BAND_H + (funnelData.length - 1) * PCT_H;

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Funnel General / Trade Channels</CardTitle>
        <CardDescription className="text-xs">Conversie vizitatori → vânzări atribuite</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-2 pb-4">
        <div className="relative w-full" style={{ height: totalH }}>
          {funnelData.map((item, i) => {
            const s = FUNNEL_STAGES[i];
            const topPx = i * (BAND_H + PCT_H);
            return (
              <div key={item.stage} className="absolute w-full" style={{ top: topPx, height: BAND_H }}>
                {/* trapezoid band */}
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

                {/* percentage label centered between this band and the next */}
                {i < funnelData.length - 1 && (
                  <div
                    className="absolute w-full flex items-center justify-center"
                    style={{ top: BAND_H, height: PCT_H }}
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      {funnelData[i + 1].pct}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 mb-1">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Leads</p>
            <p className="text-sm font-bold">8.760</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Cost / Lead</p>
            <p className="text-sm font-bold">2,83 RON</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ROIPeCanal() {
  const avgROAS = (roiData.reduce((s, d) => s + d.value, 0) / roiData.length).toFixed(2);
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">ROAS pe Canal</CardTitle>
        <CardDescription className="text-xs">Randamentul investiției per canal publicitar</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-4 py-3">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <PieChart width={150} height={150}>
            <Pie data={roiData} cx={70} cy={70} innerRadius={46} outerRadius={70} dataKey="value" stroke="none">
              {roiData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number | undefined) => [`${v ?? 0}x`, "ROAS"] as [string, string]}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold">{avgROAS}x</span>
            <span className="text-xs text-muted-foreground">ROAS mediu</span>
          </div>
        </div>
        {/* Legend right */}
        <div className="flex flex-col gap-3">
          {roiData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-xs text-muted-foreground leading-none">{item.name}</p>
                <p className="text-sm font-bold leading-tight">{item.value}x</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformantaTable() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performanță și Profitabilitate pe Canal</CardTitle>
        <CardDescription className="text-xs">Investiție, lead-uri și vânzări atribuite per canal de marketing</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Canal", "Investiție", "Clicks", "CTR", "Lead-uri", "Cost/Lead", "Vânzări Atrib.", "Vânzări App", "Total Vânzări", "Conversii", "ROI"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {performanceRows.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium">{row.canal}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.investitie > 0 ? fmtRON(row.investitie) : "—"}</td>
                  <td className="px-4 py-2.5">{row.clicks.toLocaleString("ro-RO")}</td>
                  <td className="px-4 py-2.5">{row.ctr}</td>
                  <td className="px-4 py-2.5">{row.leads.toLocaleString("ro-RO")}</td>
                  <td className="px-4 py-2.5">{row.costLead > 0 ? `${row.costLead.toFixed(2)} RON` : "—"}</td>
                  <td className="px-4 py-2.5 font-medium">{fmtRON(row.vanzariAtrib)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmtRON(row.vanzariApp)}</td>
                  <td className="px-4 py-2.5 font-semibold text-green-600">{fmtRON(row.total)}</td>
                  <td className="px-4 py-2.5">{row.conversii}</td>
                  <td className="px-4 py-2.5">
                    {row.roi !== null ? (
                      <span className={`font-semibold ${row.roi >= 50 ? "text-green-600" : row.roi >= 20 ? "text-yellow-600" : "text-red-500"}`}>
                        {row.roi.toFixed(1)}x
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

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

export function MarketingPerformance() {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Channel KPI cards */}
      <ChannelKPICards />

      {/* 2. Profitabilitate + Funnel + ROI — one row */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        <div className="md:col-span-4"><PrognozaBarChart /></div>
        <div className="md:col-span-3"><FunnelGeneral /></div>
        <div className="md:col-span-3"><ROIPeCanal /></div>
      </div>

      {/* 3. Performance table */}
      <PerformantaTable />

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
