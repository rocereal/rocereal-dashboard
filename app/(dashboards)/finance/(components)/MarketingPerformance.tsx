"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar, CartesianGrid, Cell, ComposedChart, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

// ─── Dummy data ────────────────────────────────────────────────────────────────

const channelKPIs = [
  { label: "Facebook",           value: "7.850 RON",  sub: "Investiție",         trend: +12.4, icon: "📘" },
  { label: "Google",             value: "6.450 RON",  sub: "Investiție",         trend: -3.1,  icon: "🔍" },
  { label: "TikTok",             value: "10.450 RON", sub: "Investiție",         trend: +28.6, icon: "🎵" },
  { label: "Total Investiție",   value: "24.750 RON", sub: "Toate canalele",     trend: +8.2,  icon: "💰" },
  { label: "Apeluri Generate",   value: "4.412",      sub: "din campanii",       trend: +5.7,  icon: "📞" },
  { label: "Sesizări Atribuite", value: "28",         sub: "luna aceasta",       trend: -10.0, icon: "📋" },
  { label: "Best ROI Canal",     value: "92.060 RON", sub: "Vânzări atribuite",  trend: +18.3, icon: "🏆" },
];

const funnelData = [
  { stage: "Vizitatori Unici",    value: 1_434_000, pct: 100 },
  { stage: "Leads Generate",      value: 8_760,     pct: 0.61 },
  { stage: "Oferte Trimise",      value: 2_190,     pct: 25.0 },
  { stage: "Vânzări Atribuite",   value: 438,       pct: 20.0 },
];

const roiData = [
  { name: "Facebook", value: 4.2,  color: "#1877f2" },
  { name: "Google",   value: 6.1,  color: "#ea4335" },
  { name: "TikTok",   value: 3.76, color: "#010101" },
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

const trendData = [
  { luna: "Oct",  profitBrut: 142000, investitie: 18200 },
  { luna: "Nov",  profitBrut: 168000, investitie: 21000 },
  { luna: "Dec",  profitBrut: 195000, investitie: 24500 },
  { luna: "Ian",  profitBrut: 138000, investitie: 19800 },
  { luna: "Feb",  profitBrut: 176000, investitie: 22400 },
  { luna: "Mar",  profitBrut: 212000, investitie: 26100 },
  { luna: "Apr",  profitBrut: 189000, investitie: 24750 },
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
            <p className="text-lg mb-1">{kpi.icon}</p>
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

function FunnelGeneral() {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Funnel General / Trade Channels</CardTitle>
        <CardDescription className="text-xs">Conversie vizitatori → vânzări atribuite</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4 pb-4">
        {funnelData.map((item, i) => {
          const widthPct = Math.max(30, 100 - i * 18);
          const colors = ["#1877f2", "#22c55e", "#f59e0b", "#ef4444"];
          return (
            <div key={item.stage} className="flex flex-col items-center gap-0.5">
              {i > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="font-medium text-green-600">{item.pct}%</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              <div
                className="flex items-center justify-center rounded text-white text-xs font-semibold py-3 w-full transition-all"
                style={{ maxWidth: `${widthPct}%`, backgroundColor: colors[i] }}
              >
                <span className="truncate px-2">{fmtK(item.value)} · {item.stage}</span>
              </div>
            </div>
          );
        })}
        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
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
  const avgROI = (roiData.reduce((s, d) => s + d.value, 0) / roiData.length).toFixed(2);
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">ROI pe Canal</CardTitle>
        <CardDescription className="text-xs">Randamentul investiției per canal publicitar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative">
          <PieChart width={200} height={180}>
            <Pie data={roiData} cx={95} cy={85} innerRadius={52} outerRadius={82} dataKey="value" stroke="none">
              {roiData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number | undefined) => [`${v ?? 0}x`, "ROI"] as [string, string]}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold">{avgROI}x</span>
            <span className="text-xs text-muted-foreground">ROI mediu</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {roiData.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="text-sm font-bold">{item.value}x</span>
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
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Trend – Profit Brut vs Investiție</CardTitle>
        <CardDescription className="text-xs">Evoluție lunară comparativă</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={trendData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="luna" tickLine={false} axisLine={false} tickMargin={8} style={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(v) => fmtK(v)} style={{ fontSize: 11 }} width={42} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(v) => fmtK(v)} style={{ fontSize: 11 }} width={42} />
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined) => [fmtRON(value ?? 0), name === "profitBrut" ? "Profit Brut" : "Investiție"] as [string, string]}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <Bar yAxisId="left" dataKey="profitBrut" fill="var(--chart-1)" opacity={0.85} radius={[3, 3, 0, 0]} name="Profit Brut" />
            <Line yAxisId="right" type="monotone" dataKey="investitie" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} name="Investiție" />
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

      {/* 2. Funnel + ROI donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelGeneral />
        <ROIPeCanal />
      </div>

      {/* 3. Performance table */}
      <PerformantaTable />

      {/* 4. Trend chart + Top agents + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TrendProfitChart />
        </div>
        <div className="lg:col-span-2">
          <TopAgentiTable />
        </div>
      </div>

      {/* 5. Bottom metric cards */}
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
