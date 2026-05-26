"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, Minus, Banknote, Phone,
  ShoppingCart, Target, RefreshCw, Lightbulb, Percent,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS_RO_FULL = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthData {
  month: number;
  revenue: number;
  orders: number;
  calls: number;
  answered: number;
  fbSpend: number; gSpend: number; ttSpend: number;
  fbImpressions: number; gImpressions: number; ttImpressions: number;
  fbClicks: number; gClicks: number; ttClicks: number;
  fbConversions: number; gConversions: number; ttConversions: number;
  fbRevenue: number; gRevenue: number; ttRevenue: number;
}

interface StockItem {
  sku: string | null;
  category: string | null;
}

interface SaleDoc { issueDate: string; docType: string; quantity: number; value: number; vPrice: number }
interface ProductSaleItem {
  productName: string; productCode: string;
  quantity: number; vValue: number; vTotalValue: number;
  documentsList: SaleDoc[];
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(v);
const pctChg = (cur: number, prev: number): number | null =>
  prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;

// ─── Parsers (reused from weekly report) ─────────────────────────────────────

const parseFb = (v: unknown): { spend: number; impressions: number; clicks: number } => {
  const rows: Record<string, unknown>[] = Array.isArray(v)
    ? v
    : Array.isArray((v as Record<string, unknown>)?.campaigns)
      ? (v as Record<string, unknown[]>).campaigns as Record<string, unknown>[]
      : Array.isArray((v as Record<string, unknown>)?.data)
        ? (v as Record<string, unknown[]>).data as Record<string, unknown>[]
        : [];
  return {
    spend:       rows.reduce((s, r) => s + (Number(r.spend) || 0), 0),
    impressions: rows.reduce((s, r) => s + (Number(r.impressions) || 0), 0),
    clicks:      rows.reduce((s, r) => s + (Number(r.clicks) || 0), 0),
  };
};

const parseG = (v: unknown): { spend: number; impressions: number; clicks: number; conversions: number } => {
  const d = v as Record<string, Record<string, number>> | null;
  return {
    spend:       d?.overview?.spend ?? 0,
    impressions: d?.overview?.impressions ?? 0,
    clicks:      d?.overview?.clicks ?? 0,
    conversions: d?.overview?.conversions ?? 0,
  };
};

const parseTt = (v: unknown): { spend: number; impressions: number; clicks: number } => {
  const d = (v && !(v as Record<string, unknown>).error)
    ? v as Record<string, Record<string, number>>
    : null;
  return {
    spend:       d?.overview?.spend ?? 0,
    impressions: d?.overview?.impressions ?? 0,
    clicks:      d?.overview?.clicks ?? 0,
  };
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function monthRange(year: number, m: number) {
  const last = new Date(year, m + 1, 0).getDate();
  const mm = String(m + 1).padStart(2, "0");
  return { from: `${year}-${mm}-01`, to: `${year}-${mm}-${String(last).padStart(2, "0")}` };
}

// ─── VariationBadge ───────────────────────────────────────────────────────────

function VariationBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-xs text-muted-foreground">—</span>;
  const pos = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
      pct === 0 ? "text-muted-foreground" : pos ? "text-green-600" : "text-red-500"
    }`}>
      {pct === 0 ? <Minus className="h-3 w-3" /> : pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, accent, pct }: {
  label: string; value: string; sub?: string;
  icon?: React.ReactNode; accent?: string; pct?: number | null;
}) {
  return (
    <Card className={`shadow-xs border-t-4 ${accent ?? "border-t-primary"}`}>
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground leading-tight truncate">{label}</p>
            <p className="text-xl font-bold leading-tight mt-0.5">{value}</p>
            {sub && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sub}</p>}
            {pct !== undefined && <div className="mt-1"><VariationBadge pct={pct} /></div>}
          </div>
          {icon && <div className="text-muted-foreground mt-0.5">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ n, title, color = "#1e3a5f" }: { n: string; title: string; color?: string }) {
  return (
    <CardHeader className="rounded-t-lg text-white pb-3 pt-3 px-4" style={{ backgroundColor: color }}>
      <CardTitle className="text-sm font-bold tracking-wide">{n}. {title}</CardTitle>
    </CardHeader>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RenderPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear]                   = useState(currentYear);
  const [loading, setLoading]             = useState(true);
  const [monthsData, setMonthsData]       = useState<(MonthData | null)[]>(Array(12).fill(null));
  const [prevRevenue, setPrevRevenue]     = useState<number[]>(Array(12).fill(0));
  const [prevOrders, setPrevOrders]       = useState<number[]>(Array(12).fill(0));
  const [annualProducts, setAnnualProducts] = useState<ProductSaleItem[]>([]);
  const [stockItems, setStockItems]       = useState<StockItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const now        = new Date();
    const isCurrentY = year === now.getFullYear();
    const maxMonth   = isCurrentY ? now.getMonth() : 11;
    const prevYear   = year - 1;
    const monthIdxs  = Array.from({ length: maxMonth + 1 }, (_, i) => i);
    const n          = monthIdxs.length;

    const annualFrom = `${year}-01-01`;
    const annualTo   = isCurrentY ? now.toISOString().slice(0, 10) : `${year}-12-31`;

    const promises: Promise<unknown>[] = [
      // 0..n-1   : current year metrics
      ...monthIdxs.map(m => { const r = monthRange(year, m); return fetch(`/api/finance/metrics?from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // n..2n-1  : calls
      ...monthIdxs.map(m => { const r = monthRange(year, m); return fetch(`/api/crm/calls?counts=1&from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // 2n..3n-1 : attribution
      ...monthIdxs.map(m => { const r = monthRange(year, m); return fetch(`/api/finance/attribution?from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // 3n..4n-1 : facebook ads
      ...monthIdxs.map(m => { const r = monthRange(year, m); return fetch(`/api/education/facebook-ads?level=campaign&from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // 4n..5n-1 : google ads
      ...monthIdxs.map(m => { const r = monthRange(year, m); return fetch(`/api/google-ads/campaigns?from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // 5n..6n-1 : tiktok ads
      ...monthIdxs.map(m => { const r = monthRange(year, m); return fetch(`/api/tiktok-ads/campaigns?from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // 6n..7n-1 : prev year metrics
      ...monthIdxs.map(m => { const r = monthRange(prevYear, m); return fetch(`/api/finance/metrics?from=${r.from}&to=${r.to}`, { cache: "no-store" }).then(x => x.json()); }),
      // 7n      : smartbill annual
      fetch(`/api/smartbill/product-sales?from=${annualFrom}&to=${annualTo}`, { cache: "no-store" }).then(x => x.json()),
      // 7n+1    : stock (category map)
      fetch("/api/stock", { cache: "no-store" }).then(x => x.json()),
    ];

    const results = await Promise.allSettled(promises);
    const get = <T,>(i: number): T | null => {
      const r = results[i];
      return r.status === "fulfilled" ? (r.value as T) : null;
    };

    const newMonths: (MonthData | null)[] = Array(12).fill(null);
    for (let mi = 0; mi < n; mi++) {
      const metrics = get<{ incasate: { total: number; count: number } }>(mi);
      const calls   = get<{ total: number; answered: number; channels: { facebook: number; tiktok: number; google: number }; channelsAnswered: { facebook: number; tiktok: number; google: number } }>(n + mi);
      const attr    = get<{ facebook: { conversions: number; revenue: number }; tiktok: { conversions: number; revenue: number }; google: { conversions: number; revenue: number } }>(2 * n + mi);
      const fbRaw   = get<unknown>(3 * n + mi);
      const gRaw    = get<unknown>(4 * n + mi);
      const ttRaw   = get<unknown>(5 * n + mi);

      const fb = fbRaw ? parseFb(fbRaw) : { spend: 0, impressions: 0, clicks: 0 };
      const g  = gRaw  ? parseG(gRaw)  : { spend: 0, impressions: 0, clicks: 0, conversions: 0 };
      const tt = ttRaw ? parseTt(ttRaw) : { spend: 0, impressions: 0, clicks: 0 };

      newMonths[mi] = {
        month: mi,
        revenue:       metrics?.incasate?.total ?? 0,
        orders:        metrics?.incasate?.count ?? 0,
        calls:         calls?.total ?? 0,
        answered:      calls?.answered ?? 0,
        fbSpend:       fb.spend,    gSpend:       g.spend,    ttSpend:       tt.spend,
        fbImpressions: fb.impressions, gImpressions: g.impressions, ttImpressions: tt.impressions,
        fbClicks:      fb.clicks,   gClicks:      g.clicks,   ttClicks:      tt.clicks,
        fbConversions: attr?.facebook?.conversions ?? 0,
        gConversions:  attr?.google?.conversions   ?? 0,
        ttConversions: attr?.tiktok?.conversions   ?? 0,
        fbRevenue:     attr?.facebook?.revenue ?? 0,
        gRevenue:      attr?.google?.revenue   ?? 0,
        ttRevenue:     attr?.tiktok?.revenue   ?? 0,
      };
    }

    const newPrevRev: number[] = Array(12).fill(0);
    const newPrevOrd: number[] = Array(12).fill(0);
    for (let mi = 0; mi < n; mi++) {
      const pm = get<{ incasate: { total: number; count: number } }>(6 * n + mi);
      newPrevRev[mi] = pm?.incasate?.total ?? 0;
      newPrevOrd[mi] = pm?.incasate?.count ?? 0;
    }

    const sbData = get<{ products: ProductSaleItem[] }>(7 * n);
    const stock  = get<{ items: StockItem[] }>(7 * n + 1);

    setMonthsData(newMonths);
    setPrevRevenue(newPrevRev);
    setPrevOrders(newPrevOrd);
    setAnnualProducts(sbData?.products ?? []);
    setStockItems(stock?.items ?? []);
    setLoading(false);
  }, [year]);

  useEffect(() => { load(); }, [load]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const filledMonths = useMemo(
    () => monthsData.filter(Boolean) as MonthData[],
    [monthsData],
  );

  const totals = useMemo(() => ({
    revenue:        filledMonths.reduce((s, m) => s + m.revenue, 0),
    orders:         filledMonths.reduce((s, m) => s + m.orders, 0),
    calls:          filledMonths.reduce((s, m) => s + m.calls, 0),
    answered:       filledMonths.reduce((s, m) => s + m.answered, 0),
    fbSpend:        filledMonths.reduce((s, m) => s + m.fbSpend, 0),
    gSpend:         filledMonths.reduce((s, m) => s + m.gSpend, 0),
    ttSpend:        filledMonths.reduce((s, m) => s + m.ttSpend, 0),
    fbImpressions:  filledMonths.reduce((s, m) => s + m.fbImpressions, 0),
    gImpressions:   filledMonths.reduce((s, m) => s + m.gImpressions, 0),
    ttImpressions:  filledMonths.reduce((s, m) => s + m.ttImpressions, 0),
    fbClicks:       filledMonths.reduce((s, m) => s + m.fbClicks, 0),
    gClicks:        filledMonths.reduce((s, m) => s + m.gClicks, 0),
    ttClicks:       filledMonths.reduce((s, m) => s + m.ttClicks, 0),
    fbConversions:  filledMonths.reduce((s, m) => s + m.fbConversions, 0),
    gConversions:   filledMonths.reduce((s, m) => s + m.gConversions, 0),
    ttConversions:  filledMonths.reduce((s, m) => s + m.ttConversions, 0),
    fbRevenue:      filledMonths.reduce((s, m) => s + m.fbRevenue, 0),
    gRevenue:       filledMonths.reduce((s, m) => s + m.gRevenue, 0),
    ttRevenue:      filledMonths.reduce((s, m) => s + m.ttRevenue, 0),
  }), [filledMonths]);

  const totalSpend      = totals.fbSpend + totals.gSpend + totals.ttSpend;
  const totalAttrRev    = totals.fbRevenue + totals.gRevenue + totals.ttRevenue;
  const totalRoas       = totalSpend > 0 ? totals.revenue / totalSpend : 0;
  const convRate        = totals.calls > 0 ? (totals.answered / totals.calls) * 100 : 0;
  const avgOrderVal     = totals.orders > 0 ? totals.revenue / totals.orders : 0;
  const prevTotalRev    = prevRevenue.reduce((s, v) => s + v, 0);
  const prevTotalOrders = prevOrders.reduce((s, v) => s + v, 0);
  const yoyRev          = pctChg(totals.revenue, prevTotalRev);
  const yoyOrders       = pctChg(totals.orders, prevTotalOrders);

  const catMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of stockItems) if (i.sku && i.category) m.set(i.sku, i.category);
    return m;
  }, [stockItems]);

  const categoryPerf = useMemo(() => {
    const map = new Map<string, { revenue: number; orders: number; qty: number }>();
    for (const p of annualProducts) {
      const cat     = catMap.get(p.productCode) ?? "Necategorizat";
      const cur     = map.get(cat) ?? { revenue: 0, orders: 0, qty: 0 };
      const ordersN = p.documentsList.filter(d => d.docType === "factura").length;
      map.set(cat, { revenue: cur.revenue + p.vTotalValue, orders: cur.orders + ordersN, qty: cur.qty + p.quantity });
    }
    return Array.from(map.entries())
      .map(([cat, v]) => ({ cat, ...v }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [annualProducts, catMap]);

  const topProducts = useMemo(() =>
    annualProducts
      .filter(p => p.quantity > 0)
      .map(p => ({
        name:    p.productName,
        cat:     catMap.get(p.productCode) ?? "Necategorizat",
        qty:     p.quantity,
        revenue: p.vTotalValue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10),
  [annualProducts, catMap]);

  const quarterlyData = useMemo(() =>
    [
      { label: "Q1 (Ian–Mar)", months: [0, 1, 2] },
      { label: "Q2 (Apr–Iun)", months: [3, 4, 5] },
      { label: "Q3 (Iul–Sep)", months: [6, 7, 8] },
      { label: "Q4 (Oct–Dec)", months: [9, 10, 11] },
    ].map(q => {
      const ms = q.months.map(i => monthsData[i]).filter(Boolean) as MonthData[];
      return {
        label:    q.label,
        revenue:  ms.reduce((s, m) => s + m.revenue, 0),
        spend:    ms.reduce((s, m) => s + m.fbSpend + m.gSpend + m.ttSpend, 0),
        orders:   ms.reduce((s, m) => s + m.orders, 0),
        calls:    ms.reduce((s, m) => s + m.calls, 0),
        answered: ms.reduce((s, m) => s + m.answered, 0),
      };
    }),
  [monthsData]);

  const monthlyCategoryRevenue = useMemo(() => {
    const data: Map<number, Map<string, number>> = new Map();
    for (let m = 0; m < 12; m++) data.set(m, new Map());
    for (const product of annualProducts) {
      const cat = catMap.get(product.productCode) ?? "Necategorizat";
      for (const doc of product.documentsList) {
        if (doc.docType !== "factura") continue;
        const s = doc.issueDate;
        let month = -1;
        if (s?.includes("-")) {
          month = new Date(s).getMonth();
        } else if (s?.includes("/")) {
          month = parseInt(s.split("/")[1], 10) - 1;
        }
        if (month < 0 || month > 11) continue;
        const mm = data.get(month)!;
        mm.set(cat, (mm.get(cat) ?? 0) + doc.value);
      }
    }
    return data;
  }, [annualProducts, catMap]);

  const channelRows = useMemo(() => [
    { canal: "Facebook Ads",  color: "#1877F2", spend: totals.fbSpend, impressions: totals.fbImpressions, clicks: totals.fbClicks, conversions: totals.fbConversions, revenue: totals.fbRevenue },
    { canal: "Google Ads",    color: "#4285F4", spend: totals.gSpend,  impressions: totals.gImpressions,  clicks: totals.gClicks,  conversions: totals.gConversions,  revenue: totals.gRevenue  },
    { canal: "TikTok Ads",    color: "#000000", spend: totals.ttSpend, impressions: totals.ttImpressions, clicks: totals.ttClicks, conversions: totals.ttConversions, revenue: totals.ttRevenue },
  ], [totals]);

  const insights = useMemo(() => {
    if (filledMonths.length === 0) return [];
    const lines: string[] = [];

    const bestRev = [...filledMonths].sort((a, b) => b.revenue - a.revenue)[0];
    if (bestRev?.revenue > 0)
      lines.push(`Luna cu cea mai mare cifră de afaceri: <strong>${MONTHS_RO_FULL[bestRev.month]}</strong> (${fmtRON(bestRev.revenue)}).`);

    const best = [...filledMonths]
      .filter(m => m.fbSpend + m.gSpend + m.ttSpend > 0)
      .sort((a, b) => {
        const ra = a.revenue / (a.fbSpend + a.gSpend + a.ttSpend);
        const rb = b.revenue / (b.fbSpend + b.gSpend + b.ttSpend);
        return rb - ra;
      })[0];
    if (best) {
      const r = best.revenue / (best.fbSpend + best.gSpend + best.ttSpend);
      lines.push(`ROAS maxim lunar în <strong>${MONTHS_RO_FULL[best.month]}</strong>: ${r.toFixed(1)}x.`);
    }

    if (totals.revenue > 0 && totalSpend > 0)
      lines.push(`Investiția în marketing reprezintă <strong>${((totalSpend / totals.revenue) * 100).toFixed(1)}%</strong> din cifra de afaceri anuală.`);

    if (totals.calls > 0)
      lines.push(`Rata de răspuns la apeluri: <strong>${convRate.toFixed(1)}%</strong> (${fmtNum(totals.answered)} din ${fmtNum(totals.calls)} apeluri totale).`);

    if (categoryPerf.length > 0) {
      const top = categoryPerf[0];
      const pct = totals.revenue > 0 ? ((top.revenue / totals.revenue) * 100).toFixed(1) : "0";
      lines.push(`Categoria dominantă: <strong>${top.cat}</strong> — ${fmtRON(top.revenue)} (${pct}% din CA).`);
    }

    if (yoyRev !== null) {
      const arrow = yoyRev >= 0 ? "↑" : "↓";
      lines.push(`Evoluție față de ${year - 1}: <strong>${arrow} ${Math.abs(yoyRev)}%</strong> CA (${fmtRON(totals.revenue)} vs ${fmtRON(prevTotalRev)}).`);
    }

    return lines;
  }, [filledMonths, totals, totalSpend, convRate, categoryPerf, yoyRev, prevTotalRev, year]);

  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Raport Anual"
        subtitle={`Performanță marketing și vânzări — ${year}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapoarte Financiare", href: "/finance" },
          { label: "Raport Anual" },
        ]}
      />

      {/* Year selector + Refresh */}
      <div className="flex items-center gap-3">
        <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
          <SelectTrigger className="w-28 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(y => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
          Actualizează
        </Button>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          label="Cifră de Afaceri"
          value={loading ? "—" : fmtRON(totals.revenue)}
          sub={prevTotalRev > 0 ? `${year - 1}: ${fmtRON(prevTotalRev)}` : undefined}
          icon={<Banknote className="h-4 w-4" />}
          accent="border-t-[#1e3a5f]"
          pct={yoyRev}
        />
        <KpiCard
          label="Comenzi"
          value={loading ? "—" : fmtNum(totals.orders)}
          sub={avgOrderVal > 0 ? `Val. medie: ${fmtRON(avgOrderVal)}` : undefined}
          icon={<ShoppingCart className="h-4 w-4" />}
          accent="border-t-[#27ae60]"
          pct={yoyOrders}
        />
        <KpiCard
          label="Investiție Marketing"
          value={loading ? "—" : fmtRON(totalSpend)}
          sub={totals.revenue > 0 && totalSpend > 0 ? `${((totalSpend / totals.revenue) * 100).toFixed(1)}% din CA` : undefined}
          icon={<Target className="h-4 w-4" />}
          accent="border-t-[#e74c3c]"
        />
        <KpiCard
          label="ROAS Mediu Anual"
          value={loading ? "—" : (totalRoas > 0 ? `${totalRoas.toFixed(2)}x` : "—")}
          sub="Cifră de afaceri / Spend"
          icon={<Percent className="h-4 w-4" />}
          accent="border-t-[#f39c12]"
        />
        <KpiCard
          label="Apeluri Totale"
          value={loading ? "—" : fmtNum(totals.calls)}
          sub={totals.answered > 0 ? `Răspunse: ${fmtNum(totals.answered)}` : undefined}
          icon={<Phone className="h-4 w-4" />}
          accent="border-t-[#8e44ad]"
        />
        <KpiCard
          label="Rată Conversie"
          value={loading ? "—" : (convRate > 0 ? `${convRate.toFixed(1)}%` : "—")}
          sub="Apeluri răspunse / total"
          icon={<Target className="h-4 w-4" />}
          accent="border-t-[#16a085]"
        />
      </div>

      {/* 2. Monthly overview table */}
      <Card className="shadow-xs">
        <SectionHeader n="2" title="EVOLUȚIE LUNARĂ" color="#1e3a5f" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#1e3a5f]/10 border-b">
                  {["Lună", "CA (RON)", "Var. YoY", "Comenzi", "Invest. Mktg", "ROAS", "Apeluri", "Răspunse", "Conv. %"].map(h => (
                    <th key={h} className="text-left font-semibold text-[#1e3a5f] px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
                ) : (
                  <>
                    {MONTHS_RO_FULL.map((mLabel, i) => {
                      const m     = monthsData[i];
                      const spend = m ? m.fbSpend + m.gSpend + m.ttSpend : 0;
                      const roas  = spend > 0 && m ? m.revenue / spend : null;
                      const conv  = m && m.calls > 0 ? (m.answered / m.calls) * 100 : null;
                      const yoy   = pctChg(m?.revenue ?? 0, prevRevenue[i]);
                      return (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-2 font-medium">{mLabel}</td>
                          <td className="px-3 py-2 font-semibold text-[#1e3a5f]">{m?.revenue ? fmtRON(m.revenue) : "—"}</td>
                          <td className="px-3 py-2"><VariationBadge pct={m?.revenue ? yoy : null} /></td>
                          <td className="px-3 py-2">{m?.orders ? fmtNum(m.orders) : "—"}</td>
                          <td className="px-3 py-2 text-orange-700">{spend > 0 ? fmtRON(spend) : "—"}</td>
                          <td className="px-3 py-2">{roas !== null ? `${roas.toFixed(2)}x` : "—"}</td>
                          <td className="px-3 py-2">{m?.calls ? fmtNum(m.calls) : "—"}</td>
                          <td className="px-3 py-2">{m?.answered ? fmtNum(m.answered) : "—"}</td>
                          <td className="px-3 py-2">{conv !== null ? `${conv.toFixed(1)}%` : "—"}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-[#1e3a5f]/5 font-bold border-t-2 text-xs">
                      <td className="px-3 py-2">TOTAL</td>
                      <td className="px-3 py-2 text-[#1e3a5f]">{totals.revenue > 0 ? fmtRON(totals.revenue) : "—"}</td>
                      <td className="px-3 py-2"><VariationBadge pct={yoyRev} /></td>
                      <td className="px-3 py-2">{totals.orders > 0 ? fmtNum(totals.orders) : "—"}</td>
                      <td className="px-3 py-2 text-orange-700">{totalSpend > 0 ? fmtRON(totalSpend) : "—"}</td>
                      <td className="px-3 py-2">{totalRoas > 0 ? `${totalRoas.toFixed(2)}x` : "—"}</td>
                      <td className="px-3 py-2">{totals.calls > 0 ? fmtNum(totals.calls) : "—"}</td>
                      <td className="px-3 py-2">{totals.answered > 0 ? fmtNum(totals.answered) : "—"}</td>
                      <td className="px-3 py-2">{convRate > 0 ? `${convRate.toFixed(1)}%` : "—"}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Monthly sales by category */}
      <Card className="shadow-xs">
        <SectionHeader n="3" title="VÂNZĂRI LUNARE PE CATEGORII" color="#8e44ad" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#8e44ad]/10 border-b">
                  <th className="text-left font-semibold text-[#8e44ad] px-3 py-2 whitespace-nowrap">Lună</th>
                  {categoryPerf.map(c => (
                    <th key={c.cat} className="text-left font-semibold text-[#8e44ad] px-3 py-2 whitespace-nowrap">{c.cat}</th>
                  ))}
                  <th className="text-left font-semibold text-[#8e44ad] px-3 py-2 whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={categoryPerf.length + 2} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
                ) : (
                  <>
                    {MONTHS_RO_FULL.map((mLabel, i) => {
                      const mm = monthlyCategoryRevenue.get(i) ?? new Map<string, number>();
                      const rowTotal = categoryPerf.reduce((s, c) => s + (mm.get(c.cat) ?? 0), 0);
                      return (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-2 font-medium">{mLabel}</td>
                          {categoryPerf.map(c => {
                            const v = mm.get(c.cat) ?? 0;
                            return (
                              <td key={c.cat} className="px-3 py-2 text-[#1e3a5f]">
                                {v > 0 ? fmtRON(v) : "—"}
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 font-semibold text-[#1e3a5f]">
                            {rowTotal > 0 ? fmtRON(rowTotal) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-[#8e44ad]/5 font-bold border-t-2">
                      <td className="px-3 py-2">TOTAL</td>
                      {categoryPerf.map(c => (
                        <td key={c.cat} className="px-3 py-2 text-[#1e3a5f]">
                          {c.revenue > 0 ? fmtRON(c.revenue) : "—"}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-[#1e3a5f]">
                        {totals.revenue > 0 ? fmtRON(totals.revenue) : "—"}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Category performance */}
      <Card className="shadow-xs">
        <SectionHeader n="4" title="PERFORMANȚĂ PE CATEGORII" color="#27ae60" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#27ae60]/10 border-b">
                  {["Categorie", "CA (RON)", "Comenzi", "Unități", "CA medie / comandă", "% din CA total"].map(h => (
                    <th key={h} className="text-left font-semibold text-[#27ae60] px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
                ) : categoryPerf.length === 0 ? (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Nu există date.</td></tr>
                ) : (
                  categoryPerf.map((c, i) => {
                    const pct    = totals.revenue > 0 ? ((c.revenue / totals.revenue) * 100).toFixed(1) : "0";
                    const avgOrd = c.orders > 0 ? c.revenue / c.orders : 0;
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2 font-medium">{c.cat}</td>
                        <td className="px-3 py-2 font-semibold text-[#1e3a5f]">{fmtRON(c.revenue)}</td>
                        <td className="px-3 py-2">{fmtNum(c.orders)}</td>
                        <td className="px-3 py-2">{fmtNum(c.qty)}</td>
                        <td className="px-3 py-2">{avgOrd > 0 ? fmtRON(avgOrd) : "—"}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 rounded-full bg-[#27ae60]/20 w-16">
                              <div className="h-full rounded-full bg-[#27ae60]" style={{ width: `${Math.min(100, Number(pct))}%` }} />
                            </div>
                            <span className="text-[#1e3a5f] font-semibold">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5+6. Top products + Channel performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 5. Top 10 products */}
        <Card className="shadow-xs">
          <SectionHeader n="5" title="TOP 10 PRODUSE (DUPĂ VALOARE)" color="#d35400" />
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#d35400]/10 border-b">
                  {["#", "Produs", "Categorie", "Buc.", "CA (RON)", "% din CA"].map(h => (
                    <th key={h} className="text-left font-semibold text-[#d35400] px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
                ) : topProducts.length === 0 ? (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Nu există date.</td></tr>
                ) : (
                  topProducts.map((p, i) => {
                    const pct = totals.revenue > 0 ? ((p.revenue / totals.revenue) * 100).toFixed(1) : "0";
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2 text-muted-foreground font-bold">{i + 1}</td>
                        <td className="px-3 py-2 font-medium max-w-[160px]">
                          <p className="truncate" title={p.name}>{p.name}</p>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground max-w-[80px]">
                          <p className="truncate">{p.cat}</p>
                        </td>
                        <td className="px-3 py-2">{fmtNum(p.qty)}</td>
                        <td className="px-3 py-2 font-semibold text-[#1e3a5f]">{fmtRON(p.revenue)}</td>
                        <td className="px-3 py-2 font-semibold text-[#d35400]">{pct}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* 6. Annual channel performance */}
        <Card className="shadow-xs">
          <SectionHeader n="6" title="PERFORMANȚĂ CANALE (ANUAL)" color="#2c3e50" />
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#2c3e50]/10 border-b">
                  {["Canal", "Spend", "Impresii", "Clickuri", "CTR", "Conv.", "CA Atrib.", "ROAS"].map(h => (
                    <th key={h} className="text-left font-semibold text-[#2c3e50] px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
                ) : (
                  <>
                    {channelRows.map((r, i) => {
                      const ctr  = r.impressions > 0 ? ((r.clicks / r.impressions) * 100).toFixed(2) + "%" : "—";
                      const roas = r.spend > 0 ? (r.revenue / r.spend).toFixed(2) + "x" : "—";
                      return (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                              <span className="font-medium">{r.canal}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 font-semibold text-orange-700">{r.spend > 0 ? fmtRON(r.spend) : "—"}</td>
                          <td className="px-3 py-2">{r.impressions > 0 ? fmtNum(r.impressions) : "—"}</td>
                          <td className="px-3 py-2">{r.clicks > 0 ? fmtNum(r.clicks) : "—"}</td>
                          <td className="px-3 py-2">{ctr}</td>
                          <td className="px-3 py-2">{r.conversions > 0 ? fmtNum(r.conversions) : "—"}</td>
                          <td className="px-3 py-2 font-semibold text-[#27ae60]">{r.revenue > 0 ? fmtRON(r.revenue) : "—"}</td>
                          <td className="px-3 py-2 font-semibold">{roas}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-[#2c3e50]/5 font-bold border-t-2">
                      <td className="px-3 py-2">TOTAL</td>
                      <td className="px-3 py-2 text-orange-700">{totalSpend > 0 ? fmtRON(totalSpend) : "—"}</td>
                      <td className="px-3 py-2">{totals.fbImpressions + totals.gImpressions + totals.ttImpressions > 0 ? fmtNum(totals.fbImpressions + totals.gImpressions + totals.ttImpressions) : "—"}</td>
                      <td className="px-3 py-2">{totals.fbClicks + totals.gClicks + totals.ttClicks > 0 ? fmtNum(totals.fbClicks + totals.gClicks + totals.ttClicks) : "—"}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">{totals.fbConversions + totals.gConversions + totals.ttConversions > 0 ? fmtNum(totals.fbConversions + totals.gConversions + totals.ttConversions) : "—"}</td>
                      <td className="px-3 py-2 text-[#27ae60]">{totalAttrRev > 0 ? fmtRON(totalAttrRev) : "—"}</td>
                      <td className="px-3 py-2">{totalSpend > 0 && totalAttrRev > 0 ? `${(totalAttrRev / totalSpend).toFixed(2)}x` : "—"}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* 7. Quarterly summary */}
      <Card className="shadow-xs">
        <SectionHeader n="7" title="SUMAR TRIMESTRIAL" color="#16a085" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#16a085]/10 border-b">
                  {["Trimestru", "CA (RON)", "Invest. Mktg", "ROAS", "Comenzi", "Apeluri", "Răspunse", "Conv. %"].map(h => (
                    <th key={h} className="text-left font-semibold text-[#16a085] px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
                ) : (
                  <>
                    {quarterlyData.map((q, i) => {
                      const roas = q.spend > 0 ? (q.revenue / q.spend).toFixed(2) : null;
                      const conv = q.calls  > 0 ? ((q.answered / q.calls) * 100).toFixed(1) : null;
                      return (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5 font-semibold">{q.label}</td>
                          <td className="px-4 py-2.5 font-bold text-[#1e3a5f]">{q.revenue > 0 ? fmtRON(q.revenue) : "—"}</td>
                          <td className="px-4 py-2.5 text-orange-700">{q.spend > 0 ? fmtRON(q.spend) : "—"}</td>
                          <td className="px-4 py-2.5">{roas ? `${roas}x` : "—"}</td>
                          <td className="px-4 py-2.5">{q.orders > 0 ? fmtNum(q.orders) : "—"}</td>
                          <td className="px-4 py-2.5">{q.calls > 0 ? fmtNum(q.calls) : "—"}</td>
                          <td className="px-4 py-2.5">{q.answered > 0 ? fmtNum(q.answered) : "—"}</td>
                          <td className="px-4 py-2.5">{conv ? `${conv}%` : "—"}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-[#16a085]/5 font-bold border-t-2">
                      <td className="px-4 py-2.5">TOTAL AN</td>
                      <td className="px-4 py-2.5 text-[#1e3a5f]">{totals.revenue > 0 ? fmtRON(totals.revenue) : "—"}</td>
                      <td className="px-4 py-2.5 text-orange-700">{totalSpend > 0 ? fmtRON(totalSpend) : "—"}</td>
                      <td className="px-4 py-2.5">{totalRoas > 0 ? `${totalRoas.toFixed(2)}x` : "—"}</td>
                      <td className="px-4 py-2.5">{totals.orders > 0 ? fmtNum(totals.orders) : "—"}</td>
                      <td className="px-4 py-2.5">{totals.calls > 0 ? fmtNum(totals.calls) : "—"}</td>
                      <td className="px-4 py-2.5">{totals.answered > 0 ? fmtNum(totals.answered) : "—"}</td>
                      <td className="px-4 py-2.5">{convRate > 0 ? `${convRate.toFixed(1)}%` : "—"}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 9. Auto-generated insights */}
      <Card className="shadow-xs border-l-4 border-l-[#f39c12]">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#f39c12]">
            <Lightbulb className="h-4 w-4" />
            8. INSIGHTS AUTOMATE — {year}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Se generează insight-uri...</p>
          ) : insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nu există suficiente date pentru a genera insight-uri.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {insights.map((line, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-[#f39c12] font-bold mt-0.5 flex-shrink-0">•</span>
                  <span dangerouslySetInnerHTML={{ __html: line }} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
