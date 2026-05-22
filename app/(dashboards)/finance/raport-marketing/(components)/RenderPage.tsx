"use client";

import { useCallback, useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, subWeeks, addDays } from "date-fns";
import { ro } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, Phone, ShoppingCart, BarChart3,
  Package, Percent, Banknote, MessageSquare, Minus,
} from "lucide-react";

// ─── Date helpers ─────────────────────────────────────────────────────────────

const toISO = (d: Date) => format(d, "yyyy-MM-dd");

function getWeekRange(base: Date) {
  const from = startOfWeek(base, { weekStartsOn: 1 });
  const to   = endOfWeek(base,   { weekStartsOn: 1 });
  return { from, to };
}

function weekLabel(from: Date, to: Date) {
  const df = format(from, "d MMM", { locale: ro });
  const dt = format(to,   "d MMM yyyy", { locale: ro });
  return `${df} – ${dt}`;
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);

const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(v);

const pctChg = (cur: number, prev: number): number | null =>
  prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;

// ─── VariationBadge ───────────────────────────────────────────────────────────

function VariationBadge({ pct, invertColor }: { pct: number | null; invertColor?: boolean }) {
  if (pct === null) return <span className="text-xs text-muted-foreground">—</span>;
  const positive = invertColor ? pct < 0 : pct > 0;
  const neutral   = pct === 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
      neutral ? "text-muted-foreground" : positive ? "text-green-600" : "text-red-500"
    }`}>
      {neutral ? <Minus className="h-3 w-3" /> : positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, accent, pct, invertPct }: {
  label:      string;
  value:      string;
  sub?:       string;
  icon?:      React.ReactNode;
  accent?:    string;
  pct?:       number | null;
  invertPct?: boolean;
}) {
  return (
    <Card className={`shadow-xs border-t-4 ${accent ?? "border-t-primary"}`}>
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground leading-tight truncate">{label}</p>
            <p className="text-xl font-bold leading-tight mt-0.5">{value}</p>
            {sub && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sub}</p>}
            {pct !== undefined && <div className="mt-1"><VariationBadge pct={pct} invertColor={invertPct} /></div>}
          </div>
          {icon && <div className="text-muted-foreground mt-0.5">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockItem {
  id: string; name: string; sku: string | null; category: string | null;
  quantity: number; unitPrice: number; totalValue: number;
  unit: string | null; status: string;
}

interface MetricsData {
  incasate: { total: number; count: number; prevTotal: number; prevCount: number };
}

interface CallsData {
  total: number; answered: number;
  channels: { facebook: number; tiktok: number; google: number };
  channelsAnswered: { facebook: number; tiktok: number; google: number };
}

interface AdsData { spend: number; impressions: number; clicks: number; conversions: number }

interface AttributionData {
  facebook: { conversions: number; revenue: number };
  tiktok:   { conversions: number; revenue: number };
  google:   { conversions: number; revenue: number };
}

// ─── 1. ProductStockTable ─────────────────────────────────────────────────────

function ProductStockTable({ items, loading }: { items: StockItem[]; loading: boolean }) {
  const visible = items.filter(i => i.quantity > 0 || i.status !== "out_of_stock").slice(0, 20);
  const total   = items.reduce((s, i) => s + i.totalValue, 0);

  return (
    <Card className="shadow-xs flex flex-col">
      <CardHeader className="rounded-t-lg bg-[#1e3a5f] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">1. STOCURI PE PRODUSE (LA ZI)</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1e3a5f]/10 border-b">
                {["Nume produs", "Categorie", "Buc. în stoc", "Valoare totală (RON)", "Preț unitar (RON)"].map(h => (
                  <th key={h} className="text-left font-semibold text-[#1e3a5f] px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : visible.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-1.5 font-medium max-w-[180px]">
                    <p className="truncate" title={item.name}>{item.name}</p>
                  </td>
                  <td className="px-3 py-1.5 text-muted-foreground">{item.category ?? "—"}</td>
                  <td className={`px-3 py-1.5 font-bold ${item.status === "out_of_stock" ? "text-red-500" : item.status === "low_stock" ? "text-yellow-600" : "text-green-700"}`}>
                    {fmtNum(item.quantity)} {item.unit ?? ""}
                  </td>
                  <td className="px-3 py-1.5">{item.totalValue > 0 ? fmtRON(item.totalValue) : "—"}</td>
                  <td className="px-3 py-1.5">{item.unitPrice > 0 ? fmtRON(item.unitPrice) : "—"}</td>
                </tr>
              ))}
              <tr className="bg-[#1e3a5f]/5 font-bold border-t-2">
                <td className="px-3 py-2 font-bold" colSpan={2}>TOTAL</td>
                <td className="px-3 py-2">{fmtNum(items.reduce((s, i) => s + i.quantity, 0))}</td>
                <td className="px-3 py-2">{fmtRON(total)}</td>
                <td className="px-3 py-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. DailySalesSection (no line-item data → informative notice) ────────────

function DailySalesSection({ weekDays }: { weekDays: Date[] }) {
  const dayLabels = weekDays.map(d => capitalize(format(d, "EEE d MMM", { locale: ro })));

  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-xs">
        <CardHeader className="rounded-t-lg bg-[#2d6a4f] text-white pb-3 pt-3 px-4">
          <CardTitle className="text-sm font-bold tracking-wide">2. VÂNZĂRI ZILNICE (NR. BUCĂȚI) – PE CATEGORII</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#2d6a4f]/10 border-b">
                  <th className="text-left font-semibold text-[#2d6a4f] px-3 py-2">Categorie</th>
                  {dayLabels.map(l => (
                    <th key={l} className="text-center font-semibold text-[#2d6a4f] px-2 py-2 whitespace-nowrap">{l}</th>
                  ))}
                  <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2 whitespace-nowrap">Total săpt.</th>
                  <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2 whitespace-nowrap">vs. săpt. prec.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={dayLabels.length + 3} className="px-3 py-4 text-center text-muted-foreground text-xs">
                    Date zilnice per produs/categorie necesită sincronizare detaliată SmartBill
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="rounded-t-lg bg-[#2d6a4f] text-white pb-3 pt-3 px-4">
          <CardTitle className="text-sm font-bold tracking-wide">2B. VÂNZĂRI ZILNICE – PE PRODUSE (TOP 10)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#2d6a4f]/10 border-b">
                  <th className="text-left font-semibold text-[#2d6a4f] px-3 py-2">Produs</th>
                  {dayLabels.map(l => (
                    <th key={l} className="text-center font-semibold text-[#2d6a4f] px-2 py-2 whitespace-nowrap">{l}</th>
                  ))}
                  <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2">Total</th>
                  <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2">vs. prec.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={dayLabels.length + 3} className="px-3 py-4 text-center text-muted-foreground text-xs">
                    Date zilnice per produs/categorie necesită sincronizare detaliată SmartBill
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── 3. WeeklySalesByCategoryTable ────────────────────────────────────────────

function WeeklySalesByCategoryTable({ metrics, prevMetrics, loading }: {
  metrics:     MetricsData | null;
  prevMetrics: MetricsData | null;
  loading:     boolean;
}) {
  const cur  = metrics?.incasate.total     ?? 0;
  const prev = prevMetrics?.incasate.total ?? 0;
  const pct  = pctChg(cur, prev);

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#1a4b8c] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">3. VÂNZĂRI SĂPTĂMÂNALE (VALOARE + BUGET MARKETING) – PE CATEGORII</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a4b8c]/10 border-b">
                {[
                  "Categorie",
                  "Buc. vândute săpt. cur.",
                  "Buc. vândute săpt. prec.",
                  "Variație %",
                  "Val. vânzări cur. (RON)",
                  "Val. vânzări prec. (RON)",
                  "Variație %",
                  "Buget marketing cur. (RON)",
                  "Buget marketing prec. (RON)",
                  "Variație %",
                ].map(h => (
                  <th key={h} className="text-left font-semibold text-[#1a4b8c] px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-3 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : (
                <>
                  <tr>
                    <td colSpan={10} className="px-3 py-3 text-center text-muted-foreground text-xs">
                      Date pe categorie necesită sincronizare detaliată SmartBill
                    </td>
                  </tr>
                  <tr className="bg-[#1a4b8c]/5 font-bold border-t-2">
                    <td className="px-3 py-2">TOTAL</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">{cur > 0 ? fmtRON(cur) : "—"}</td>
                    <td className="px-3 py-2">{prev > 0 ? fmtRON(prev) : "—"}</td>
                    <td className="px-3 py-2"><VariationBadge pct={pct} /></td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. CallsByCategoryTable ──────────────────────────────────────────────────

function CallsByCategoryTable({ calls, prevCalls, loading }: {
  calls:     CallsData | null;
  prevCalls: CallsData | null;
  loading:   boolean;
}) {
  const rows = [
    {
      cat:       "Facebook Ads",
      total:     calls?.channels.facebook         ?? 0,
      answered:  calls?.channelsAnswered.facebook  ?? 0,
      prevTotal: prevCalls?.channels.facebook      ?? 0,
    },
    {
      cat:       "TikTok Ads",
      total:     calls?.channels.tiktok            ?? 0,
      answered:  calls?.channelsAnswered.tiktok    ?? 0,
      prevTotal: prevCalls?.channels.tiktok        ?? 0,
    },
    {
      cat:       "Google Ads",
      total:     calls?.channels.google            ?? 0,
      answered:  calls?.channelsAnswered.google    ?? 0,
      prevTotal: prevCalls?.channels.google        ?? 0,
    },
    {
      cat:       "Organic / Direct",
      total:     Math.max(0, (calls?.total ?? 0) - (calls?.channels.facebook ?? 0) - (calls?.channels.tiktok ?? 0) - (calls?.channels.google ?? 0)),
      answered:  Math.max(0, (calls?.answered ?? 0) - (calls?.channelsAnswered.facebook ?? 0) - (calls?.channelsAnswered.tiktok ?? 0) - (calls?.channelsAnswered.google ?? 0)),
      prevTotal: 0,
    },
  ];

  const totalRow = {
    total:    calls?.total    ?? 0,
    answered: calls?.answered ?? 0,
  };

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#5c2d8c] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">4. APELURI (PE CANAL)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#5c2d8c]/10 border-b">
                {["Canal", "Apeluri totale", "Apeluri răspunse", "Lead-uri calificate", "Rată conversie (lead/apel)"].map(h => (
                  <th key={h} className="text-left font-semibold text-[#5c2d8c] px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : rows.map((r) => (
                <tr key={r.cat} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{r.cat}</td>
                  <td className="px-3 py-2">{r.total > 0 ? fmtNum(r.total) : "—"}</td>
                  <td className="px-3 py-2">{r.answered > 0 ? fmtNum(r.answered) : "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">—</td>
                  <td className="px-3 py-2">
                    {r.total > 0
                      ? <span className="font-semibold">{((r.answered / r.total) * 100).toFixed(1)}%</span>
                      : "—"}
                  </td>
                </tr>
              ))}
              <tr className="bg-[#5c2d8c]/5 font-bold border-t-2">
                <td className="px-3 py-2">TOTAL</td>
                <td className="px-3 py-2">{fmtNum(totalRow.total)}</td>
                <td className="px-3 py-2">{fmtNum(totalRow.answered)}</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2 font-semibold">
                  {totalRow.total > 0 ? `${((totalRow.answered / totalRow.total) * 100).toFixed(1)}%` : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 5. MarketingInvestmentCard ───────────────────────────────────────────────

function MarketingInvestmentCard({ metrics, prevMetrics, totalSpend, prevSpend, loading }: {
  metrics:     MetricsData | null;
  prevMetrics: MetricsData | null;
  totalSpend:  number;
  prevSpend:   number;
  loading:     boolean;
}) {
  const ca         = metrics?.incasate.total     ?? 0;
  const prevCa     = prevMetrics?.incasate.total ?? 0;
  const pondCur    = ca > 0     ? (totalSpend / ca) * 100     : 0;
  const pondPrev   = prevCa > 0 ? (prevSpend  / prevCa) * 100 : 0;
  const deltaPoints = pondCur > 0 && pondPrev > 0 ? +(pondCur - pondPrev).toFixed(1) : null;

  const rows = [
    { label: "Cifra de afaceri (săpt. curentă)",                  value: ca > 0 ? fmtRON(ca) : "—" },
    { label: "Investiție totală marketing (toate canalele)",       value: totalSpend > 0 ? fmtRON(totalSpend) : "—" },
    { label: "Pondere investiție marketing din cifra de afaceri",  value: pondCur > 0 ? `${pondCur.toFixed(1)}%` : "—" },
    { label: "Săptămâna precedentă",                              value: pondPrev > 0 ? `${pondPrev.toFixed(1)}%` : "—" },
    {
      label: "Variație (puncte procentuale)",
      value: deltaPoints !== null
        ? <span className={deltaPoints > 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
            {deltaPoints > 0 ? "▲" : "▼"} {Math.abs(deltaPoints)} pp
          </span>
        : "—",
    },
  ];

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="rounded-t-lg bg-[#c0392b] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">5. INVESTIȚIE MARKETING VS. CIFRA DE AFACERI</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4">
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Se încarcă...</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-4 border-b last:border-0 pb-2 last:pb-0">
                <span className="text-xs text-muted-foreground leading-tight">{r.label}</span>
                <span className="text-sm font-bold whitespace-nowrap text-right">{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 6. ChannelPerformanceTable ───────────────────────────────────────────────

interface ChannelRow {
  canal:       string;
  spend:       number;
  calls:       number;
  costPerCall: number | null;
  leads:       number;
  cpl:         number | null;
  conversions: number;
  costPerConv: number | null;
  revenue:     number;
  roas:        number | null;
}

function ChannelPerformanceTable({ rows, loading }: { rows: ChannelRow[]; loading: boolean }) {
  const totals: ChannelRow = rows.reduce((acc, r) => ({
    canal:       "TOTAL",
    spend:       acc.spend       + r.spend,
    calls:       acc.calls       + r.calls,
    costPerCall: null,
    leads:       acc.leads       + r.leads,
    cpl:         null,
    conversions: acc.conversions + r.conversions,
    costPerConv: null,
    revenue:     acc.revenue     + r.revenue,
    roas:        null,
  }), { canal: "TOTAL", spend: 0, calls: 0, costPerCall: null, leads: 0, cpl: null, conversions: 0, costPerConv: null, revenue: 0, roas: null });

  const totalRoas = totals.spend > 0 && totals.revenue > 0 ? totals.revenue / totals.spend : null;
  const totalCPC  = totals.calls > 0 && totals.spend > 0 ? totals.spend / totals.calls : null;

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#2c3e50] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">6. MARKETING – PERFORMANȚĂ CANALE (TOTAL)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#2c3e50]/10 border-b">
                {["Canal", "Spend (RON)", "Apeluri generate", "Cost / apel", "Lead-uri generate", "CPL (Cost/Lead)", "Comenzi", "Cost / comandă", "Vânzări (RON)", "ROAS"].map(h => (
                  <th key={h} className="text-left font-semibold text-[#2c3e50] px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-3 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : (
                <>
                  {rows.map((r) => (
                    <tr key={r.canal} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium">{r.canal}</td>
                      <td className="px-3 py-2">{r.spend > 0 ? fmtRON(r.spend) : "—"}</td>
                      <td className="px-3 py-2">{r.calls > 0 ? fmtNum(r.calls) : "—"}</td>
                      <td className="px-3 py-2">{r.costPerCall !== null ? fmtRON(r.costPerCall) : "—"}</td>
                      <td className="px-3 py-2">{r.leads > 0 ? fmtNum(r.leads) : "—"}</td>
                      <td className="px-3 py-2">{r.cpl !== null ? fmtRON(r.cpl) : "—"}</td>
                      <td className="px-3 py-2 font-semibold">{r.conversions > 0 ? fmtNum(r.conversions) : "—"}</td>
                      <td className="px-3 py-2">{r.costPerConv !== null ? fmtRON(r.costPerConv) : "—"}</td>
                      <td className="px-3 py-2 font-semibold text-green-700 dark:text-green-400">{r.revenue > 0 ? fmtRON(r.revenue) : "—"}</td>
                      <td className="px-3 py-2">
                        {r.roas !== null && r.roas > 0 ? (
                          <span className={`font-bold ${r.roas >= 8 ? "text-green-600" : r.roas >= 4 ? "text-yellow-600" : "text-red-500"}`}>
                            {r.roas.toFixed(2)}x
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#2c3e50]/5 font-bold border-t-2">
                    <td className="px-3 py-2">TOTAL</td>
                    <td className="px-3 py-2">{totals.spend > 0 ? fmtRON(totals.spend) : "—"}</td>
                    <td className="px-3 py-2">{totals.calls > 0 ? fmtNum(totals.calls) : "—"}</td>
                    <td className="px-3 py-2">{totalCPC !== null ? fmtRON(totalCPC) : "—"}</td>
                    <td className="px-3 py-2">{totals.leads > 0 ? fmtNum(totals.leads) : "—"}</td>
                    <td className="px-3 py-2">
                      {totals.leads > 0 && totals.spend > 0 ? fmtRON(totals.spend / totals.leads) : "—"}
                    </td>
                    <td className="px-3 py-2">{totals.conversions > 0 ? fmtNum(totals.conversions) : "—"}</td>
                    <td className="px-3 py-2">
                      {totals.conversions > 0 && totals.spend > 0 ? fmtRON(totals.spend / totals.conversions) : "—"}
                    </td>
                    <td className="px-3 py-2">{totals.revenue > 0 ? fmtRON(totals.revenue) : "—"}</td>
                    <td className="px-3 py-2">
                      {totalRoas !== null && totalRoas > 0 ? (
                        <span className={`font-bold ${totalRoas >= 8 ? "text-green-600" : totalRoas >= 4 ? "text-yellow-600" : "text-red-500"}`}>
                          {totalRoas.toFixed(2)}x
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 7. NotesCard ─────────────────────────────────────────────────────────────

function NotesCard({ stockItems, channelRows, metrics, prevMetrics, loading }: {
  stockItems:  StockItem[];
  channelRows: ChannelRow[];
  metrics:     MetricsData | null;
  prevMetrics: MetricsData | null;
  loading:     boolean;
}) {
  const notes: { text: string; type: "good" | "warn" | "bad" | "info" }[] = [];

  if (!loading) {
    const ca   = metrics?.incasate.total     ?? 0;
    const prev = prevMetrics?.incasate.total ?? 0;
    const pct  = pctChg(ca, prev);
    if (pct !== null && pct > 0)  notes.push({ text: `Vânzări săptămânale +${pct}% față de săptămâna precedentă.`, type: "good" });
    if (pct !== null && pct < 0)  notes.push({ text: `Scădere vânzări săptămânale ${pct}% față de săptămâna precedentă.`, type: "bad" });

    const lowStockItems = stockItems.filter(i => i.status === "low_stock" || (i.status === "in_stock" && i.quantity <= 2));
    if (lowStockItems.length > 0) {
      notes.push({ text: `Stoc redus: ${lowStockItems.slice(0, 3).map(i => i.name).join(", ")}${lowStockItems.length > 3 ? ` +${lowStockItems.length - 3} altele` : ""}.`, type: "warn" });
    }

    const bestRoas = channelRows.filter(r => r.roas !== null && r.roas > 0).sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    if (bestRoas?.roas && bestRoas.roas >= 8) {
      notes.push({ text: `ROAS ${bestRoas.canal}: ${bestRoas.roas.toFixed(2)}x — performanță excelentă.`, type: "good" });
    }

    const worstRoas = channelRows.filter(r => r.roas !== null && r.roas > 0 && r.spend > 0).sort((a, b) => (a.roas ?? 0) - (b.roas ?? 0))[0];
    if (worstRoas?.roas && worstRoas.roas < 3) {
      notes.push({ text: `ROAS scăzut pe ${worstRoas.canal} (${worstRoas.roas.toFixed(2)}x) — optimizare necesară.`, type: "bad" });
    }

    if (notes.length === 0) {
      notes.push({ text: "Nicio anomalie detectată. Continuați monitorizarea.", type: "info" });
    }
  }

  const typeStyle = { good: "bg-green-50 text-green-800 border-green-200", warn: "bg-yellow-50 text-yellow-800 border-yellow-200", bad: "bg-red-50 text-red-800 border-red-200", info: "bg-blue-50 text-blue-800 border-blue-200" };
  const typeIcon  = { good: <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />, warn: <Package className="h-3.5 w-3.5 flex-shrink-0" />, bad: <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" />, info: <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" /> };

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="rounded-t-lg bg-[#b8860b] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">7. OBSERVAȚII / NOTE</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4">
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Se generează...</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {notes.map((n, i) => (
              <li key={i} className={`flex items-start gap-2 text-xs px-2.5 py-2 rounded border ${typeStyle[n.type]}`}>
                {typeIcon[n.type]}
                <span>{n.text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main RenderPage ──────────────────────────────────────────────────────────

export default function RenderPage() {
  const now      = new Date();
  const curWeek  = getWeekRange(now);
  const prevWeek = getWeekRange(subWeeks(now, 1));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(curWeek.from, i));

  const [stockItems,  setStockItems]  = useState<StockItem[]>([]);
  const [metrics,     setMetrics]     = useState<MetricsData | null>(null);
  const [prevMetrics, setPrevMetrics] = useState<MetricsData | null>(null);
  const [calls,       setCalls]       = useState<CallsData | null>(null);
  const [prevCalls,   setPrevCalls]   = useState<CallsData | null>(null);
  const [attribution, setAttribution] = useState<AttributionData | null>(null);
  const [fbAds,       setFbAds]       = useState<AdsData>({ spend: 0, impressions: 0, clicks: 0, conversions: 0 });
  const [gAds,        setGAds]        = useState<AdsData>({ spend: 0, impressions: 0, clicks: 0, conversions: 0 });
  const [ttAds,       setTtAds]       = useState<AdsData>({ spend: 0, impressions: 0, clicks: 0, conversions: 0 });
  const [prevTotalSpend, setPrevTotalSpend] = useState(0);
  const [loading,     setLoading]     = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const curFrom  = toISO(curWeek.from);
    const curTo    = toISO(curWeek.to);
    const prevFrom = toISO(prevWeek.from);
    const prevTo   = toISO(prevWeek.to);

    const [
      stockRes, metricsRes, prevMetricsRes, callsRes, prevCallsRes,
      attrRes, fbRes, gRes, ttRes,
      prevFbRes, prevGRes, prevTtRes,
    ] = await Promise.allSettled([
      fetch("/api/stock",                                                                             { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/metrics?from=${curFrom}&to=${curTo}`,                                       { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/metrics?from=${prevFrom}&to=${prevTo}`,                                     { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/crm/calls?counts=1&from=${curFrom}&to=${curTo}`,                                    { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/crm/calls?counts=1&from=${prevFrom}&to=${prevTo}`,                                  { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/attribution?from=${curFrom}&to=${curTo}`,                                   { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${curFrom}&to=${curTo}`,                 { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/google-ads/campaigns?from=${curFrom}&to=${curTo}`,                                  { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${curFrom}&to=${curTo}`,                                  { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${prevFrom}&to=${prevTo}`,               { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/google-ads/campaigns?from=${prevFrom}&to=${prevTo}`,                                { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${prevFrom}&to=${prevTo}`,                                { cache: "no-store" }).then(r => r.json()),
    ]);

    if (stockRes.status     === "fulfilled") setStockItems((stockRes.value as { items: StockItem[] }).items ?? []);
    if (metricsRes.status   === "fulfilled") setMetrics(metricsRes.value as MetricsData);
    if (prevMetricsRes.status === "fulfilled") setPrevMetrics(prevMetricsRes.value as MetricsData);
    if (callsRes.status     === "fulfilled") setCalls(callsRes.value as CallsData);
    if (prevCallsRes.status === "fulfilled") setPrevCalls(prevCallsRes.value as CallsData);
    if (attrRes.status      === "fulfilled") setAttribution(attrRes.value as AttributionData);

    const parseFb = (v: unknown): AdsData => {
      const rows: Record<string, unknown>[] = Array.isArray(v) ? v : (Array.isArray((v as Record<string,unknown>)?.campaigns) ? (v as Record<string,unknown[]>).campaigns as Record<string, unknown>[] : (Array.isArray((v as Record<string,unknown>)?.data) ? (v as Record<string,unknown[]>).data as Record<string, unknown>[] : []));
      return {
        spend:       rows.reduce((s, r) => s + (Number(r.spend)       || 0), 0),
        impressions: rows.reduce((s, r) => s + (Number(r.impressions) || 0), 0),
        clicks:      rows.reduce((s, r) => s + (Number(r.clicks)      || 0), 0),
        conversions: rows.reduce((s, r) => s + (Number(r.conversions) || 0), 0),
      };
    };
    const parseG = (v: unknown): AdsData => {
      const d = v as Record<string, Record<string, number>> | null;
      return { spend: d?.overview?.spend ?? 0, impressions: d?.overview?.impressions ?? 0, clicks: d?.overview?.clicks ?? 0, conversions: d?.overview?.conversions ?? 0 };
    };
    const parseTt = (v: unknown): AdsData => {
      const d = (v && !(v as Record<string,unknown>).error) ? v as Record<string, Record<string, number>> : null;
      return { spend: d?.overview?.spend ?? 0, impressions: d?.overview?.impressions ?? 0, clicks: d?.overview?.clicks ?? 0, conversions: d?.overview?.conversions ?? 0 };
    };

    if (fbRes.status  === "fulfilled") setFbAds(parseFb(fbRes.value));
    if (gRes.status   === "fulfilled") setGAds(parseG(gRes.value));
    if (ttRes.status  === "fulfilled") setTtAds(parseTt(ttRes.value));

    const prevFb = prevFbRes.status === "fulfilled" ? parseFb(prevFbRes.value).spend : 0;
    const prevG  = prevGRes.status  === "fulfilled" ? parseG(prevGRes.value).spend   : 0;
    const prevTt = prevTtRes.status === "fulfilled" ? parseTt(prevTtRes.value).spend  : 0;
    setPrevTotalSpend(prevFb + prevG + prevTt);

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Derived values ──────────────────────────────────────────────────────────

  const totalSpend    = fbAds.spend + gAds.spend + ttAds.spend;
  const totalRevenue  = metrics?.incasate.total ?? 0;
  const prevRevenue   = prevMetrics?.incasate.total ?? 0;
  const totalCalls    = calls?.total    ?? 0;
  const totalAnswered = calls?.answered ?? 0;
  const attrCur       = attribution ?? { facebook: { conversions: 0, revenue: 0 }, tiktok: { conversions: 0, revenue: 0 }, google: { conversions: 0, revenue: 0 } };
  const totalConversions = attrCur.facebook.conversions + attrCur.tiktok.conversions + attrCur.google.conversions;
  const convRate         = totalAnswered > 0 ? (totalConversions / totalAnswered) * 100 : 0;
  const investPct        = totalRevenue  > 0 ? (totalSpend / totalRevenue) * 100        : 0;

  const attrRoas = (spend: number, rev: number) => spend > 0 && rev > 0 ? +(rev / spend).toFixed(2) : null;

  const channelRows: ChannelRow[] = [
    {
      canal: "Facebook Ads",
      spend: fbAds.spend,
      calls: calls?.channels.facebook ?? 0,
      costPerCall: calls?.channelsAnswered.facebook && calls.channelsAnswered.facebook > 0 && fbAds.spend > 0 ? +(fbAds.spend / calls.channelsAnswered.facebook).toFixed(2) : null,
      leads: calls?.channels.facebook ?? 0,
      cpl:   calls?.channels.facebook && calls.channels.facebook > 0 && fbAds.spend > 0 ? +(fbAds.spend / calls.channels.facebook).toFixed(2) : null,
      conversions: attrCur.facebook.conversions,
      costPerConv: attrCur.facebook.conversions > 0 && fbAds.spend > 0 ? +(fbAds.spend / attrCur.facebook.conversions).toFixed(2) : null,
      revenue: attrCur.facebook.revenue,
      roas:    attrRoas(fbAds.spend, attrCur.facebook.revenue),
    },
    {
      canal: "TikTok Ads",
      spend: ttAds.spend,
      calls: calls?.channels.tiktok ?? 0,
      costPerCall: calls?.channelsAnswered.tiktok && calls.channelsAnswered.tiktok > 0 && ttAds.spend > 0 ? +(ttAds.spend / calls.channelsAnswered.tiktok).toFixed(2) : null,
      leads: calls?.channels.tiktok ?? 0,
      cpl:   calls?.channels.tiktok && calls.channels.tiktok > 0 && ttAds.spend > 0 ? +(ttAds.spend / calls.channels.tiktok).toFixed(2) : null,
      conversions: attrCur.tiktok.conversions,
      costPerConv: attrCur.tiktok.conversions > 0 && ttAds.spend > 0 ? +(ttAds.spend / attrCur.tiktok.conversions).toFixed(2) : null,
      revenue: attrCur.tiktok.revenue,
      roas:    attrRoas(ttAds.spend, attrCur.tiktok.revenue),
    },
    {
      canal: "Google Ads",
      spend: gAds.spend,
      calls: calls?.channels.google ?? 0,
      costPerCall: calls?.channelsAnswered.google && calls.channelsAnswered.google > 0 && gAds.spend > 0 ? +(gAds.spend / calls.channelsAnswered.google).toFixed(2) : null,
      leads: calls?.channels.google ?? 0,
      cpl:   calls?.channels.google && calls.channels.google > 0 && gAds.spend > 0 ? +(gAds.spend / calls.channels.google).toFixed(2) : null,
      conversions: attrCur.google.conversions,
      costPerConv: attrCur.google.conversions > 0 && gAds.spend > 0 ? +(gAds.spend / attrCur.google.conversions).toFixed(2) : null,
      revenue: attrCur.google.revenue,
      roas:    attrRoas(gAds.spend, attrCur.google.revenue),
    },
    {
      canal: "Organic / Direct",
      spend: 0, calls: 0, costPerCall: null, leads: 0, cpl: null,
      conversions: 0, costPerConv: null, revenue: 0, roas: null,
    },
  ];

  // ─── KPI values ──────────────────────────────────────────────────────────────

  const kpis = [
    {
      label:   "Vânzări săptămânale",
      value:   loading ? "—" : fmtRON(totalRevenue),
      sub:     "Venituri încasate",
      icon:    <Banknote className="h-5 w-5" />,
      accent:  "border-t-blue-600",
      pct:     pctChg(totalRevenue, prevRevenue),
    },
    {
      label:   "Apeluri totale",
      value:   loading ? "—" : fmtNum(totalCalls),
      sub:     `Răspunse: ${fmtNum(totalAnswered)}`,
      icon:    <Phone className="h-5 w-5" />,
      accent:  "border-t-orange-500",
      pct:     pctChg(totalCalls, calls ? 0 : 0),
    },
    {
      label:   "Comenzi plasate",
      value:   loading ? "—" : fmtNum(totalConversions),
      sub:     "Conversii atribuite",
      icon:    <ShoppingCart className="h-5 w-5" />,
      accent:  "border-t-green-600",
      pct:     null,
    },
    {
      label:   "Rată conversie apeluri → comenzi",
      value:   loading ? "—" : convRate > 0 ? `${convRate.toFixed(1)}%` : "—",
      sub:     "Apeluri răspunse → factură achitată",
      icon:    <Percent className="h-5 w-5" />,
      accent:  "border-t-purple-600",
      pct:     null,
    },
    {
      label:    "Investiție marketing / CA",
      value:    loading ? "—" : investPct > 0 ? `${investPct.toFixed(1)}%` : "—",
      sub:      totalSpend > 0 ? fmtRON(totalSpend) : "—",
      icon:     <BarChart3 className="h-5 w-5" />,
      accent:   "border-t-red-500",
      pct:      null,
      invertPct: true,
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* ── Header ── */}
      <div className="rounded-xl border bg-gradient-to-r from-[#0f2a4a] to-[#1a4b8c] text-white px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-1">Dashboard săptămânal</p>
            <h1 className="text-2xl font-black tracking-tight">RETROSPECTIVĂ SĂPTĂMÂNALĂ – MARKETING</h1>
            <div className="mt-2 flex flex-col sm:flex-row gap-3 text-xs opacity-80">
              <span><b>Săptămâna:</b> {capitalize(weekLabel(curWeek.from, curWeek.to))}</span>
              <span><b>Data raport:</b> {capitalize(format(now, "d MMMM yyyy (EEEE)", { locale: ro }))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(k => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ── Row: Stock (left) + Daily sales (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-2">
          <ProductStockTable items={stockItems} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          <DailySalesSection weekDays={weekDays} />
        </div>
      </div>

      {/* ── Weekly sales by category (full) ── */}
      <WeeklySalesByCategoryTable metrics={metrics} prevMetrics={prevMetrics} loading={loading} />

      {/* ── Row: Calls (left) + Marketing investment (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <CallsByCategoryTable calls={calls} prevCalls={prevCalls} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <MarketingInvestmentCard
            metrics={metrics} prevMetrics={prevMetrics}
            totalSpend={totalSpend} prevSpend={prevTotalSpend}
            loading={loading}
          />
        </div>
      </div>

      {/* ── Row: Channel performance (left) + Notes (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <ChannelPerformanceTable rows={channelRows} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <NotesCard
            stockItems={stockItems} channelRows={channelRows}
            metrics={metrics} prevMetrics={prevMetrics}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
