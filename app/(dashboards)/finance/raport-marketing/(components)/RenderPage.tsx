"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, startOfWeek, endOfWeek, subWeeks, addDays } from "date-fns";
import { ro } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp, TrendingDown, Phone, ShoppingCart, BarChart3,
  Package, Percent, Banknote, MessageSquare, Minus,
} from "lucide-react";

// ─── Date helpers ─────────────────────────────────────────────────────────────

const toISO = (d: Date) => format(d, "yyyy-MM-dd");
function getWeekRange(base: Date) {
  return { from: startOfWeek(base, { weekStartsOn: 1 }), to: endOfWeek(base, { weekStartsOn: 1 }) };
}
function weekLabel(from: Date, to: Date) {
  return `${format(from, "d MMM", { locale: ro })} – ${format(to, "d MMM yyyy", { locale: ro })}`;
}
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
// Parse SmartBill date "DD/MM/YYYY" to YYYY-MM-DD key
function parseSbDate(sb: string): string {
  const [d, m, y] = sb.split("/");
  return `${y}-${m}-${d}`;
}

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
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
      pct === 0 ? "text-muted-foreground" : positive ? "text-green-600" : "text-red-500"
    }`}>
      {pct === 0 ? <Minus className="h-3 w-3" /> : positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, accent, pct, invertPct }: {
  label: string; value: string; sub?: string; icon?: React.ReactNode;
  accent?: string; pct?: number | null; invertPct?: boolean;
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
  quantity: number; unitPrice: number; totalValue: number; unit: string | null; status: string;
}

interface SaleDoc {
  issueDate: string; docType: string; quantity: number; value: number; vPrice: number;
}

interface ProductSaleItem {
  productName: string; productCode: string;
  quantity: number; vValue: number; vTotalValue: number;
  documentsList: SaleDoc[];
}

interface MetricsData { incasate: { total: number; count: number; prevTotal: number; prevCount: number } }
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

// ─── Processing helpers ───────────────────────────────────────────────────────

function buildCategoryMap(items: StockItem[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const i of items) { if (i.sku && i.category) m.set(i.sku, i.category); }
  return m;
}

// Build daily sales by category: { category -> { dayIso -> { qty, val } } }
function buildDailyByCategory(
  products: ProductSaleItem[],
  catMap: Map<string, string>,
): Map<string, Map<string, { qty: number; val: number }>> {
  const result = new Map<string, Map<string, { qty: number; val: number }>>();
  for (const p of products) {
    const cat = catMap.get(p.productCode) ?? "Necategorizat";
    if (!result.has(cat)) result.set(cat, new Map());
    const catDays = result.get(cat)!;
    for (const doc of p.documentsList) {
      if (doc.docType !== "factura") continue;
      const day = parseSbDate(doc.issueDate);
      const cur = catDays.get(day) ?? { qty: 0, val: 0 };
      catDays.set(day, { qty: cur.qty + doc.quantity, val: cur.val + doc.value });
    }
  }
  return result;
}

// Build daily sales by product: { productCode -> { name, cat, dayIso -> { qty, val } } }
function buildDailyByProduct(
  products: ProductSaleItem[],
  catMap: Map<string, string>,
): { code: string; name: string; cat: string; days: Map<string, { qty: number; val: number }>; total: number }[] {
  return products
    .filter(p => p.quantity > 0)
    .map(p => {
      const days = new Map<string, { qty: number; val: number }>();
      for (const doc of p.documentsList) {
        if (doc.docType !== "factura") continue;
        const day = parseSbDate(doc.issueDate);
        const cur = days.get(day) ?? { qty: 0, val: 0 };
        days.set(day, { qty: cur.qty + doc.quantity, val: cur.val + doc.value });
      }
      return { code: p.productCode, name: p.productName, cat: catMap.get(p.productCode) ?? "Necategorizat", days, total: p.quantity };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);
}

// Weekly totals by category
function buildWeeklyByCategory(
  products: ProductSaleItem[],
  catMap: Map<string, string>,
): Map<string, { qty: number; val: number; orders: number }> {
  const result = new Map<string, { qty: number; val: number; orders: number }>();
  for (const p of products) {
    const cat = catMap.get(p.productCode) ?? "Necategorizat";
    const cur = result.get(cat) ?? { qty: 0, val: 0, orders: 0 };
    result.set(cat, {
      qty:    cur.qty + p.quantity,
      val:    cur.val + p.vTotalValue,
      orders: cur.orders + p.documentsList.filter(d => d.docType === "factura").length,
    });
  }
  return result;
}

// ─── 1. ProductStockTable ─────────────────────────────────────────────────────

function ProductStockTable({ items, loading }: { items: StockItem[]; loading: boolean }) {
  return (
    <Card className="shadow-xs flex flex-col">
      <CardHeader className="rounded-t-lg bg-[#1e3a5f] text-white pb-2 pt-2.5 px-3">
        <CardTitle className="text-sm font-bold tracking-wide">1. STOCURI PE PRODUSE (LA ZI)</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-[#1e3a5f]/10 border-b">
              {["Produs", "Cat.", "Buc.", "Valoare (RON)"].map(h => (
                <th key={h} className="text-left font-semibold text-[#1e3a5f] px-2 py-1.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-2 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
            ) : items.filter(i => i.quantity > 0).map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-2 py-1 font-medium max-w-[140px]">
                  <p className="truncate" title={item.name}>{item.name}</p>
                </td>
                <td className="px-2 py-1 text-muted-foreground max-w-[80px]">
                  <p className="truncate" title={item.category ?? "—"}>{item.category ?? "—"}</p>
                </td>
                <td className={`px-2 py-1 font-bold whitespace-nowrap ${item.status === "out_of_stock" ? "text-red-500" : item.status === "low_stock" ? "text-yellow-600" : "text-green-700"}`}>
                  {fmtNum(item.quantity)}{item.unit ? ` ${item.unit}` : ""}
                </td>
                <td className="px-2 py-1 whitespace-nowrap">{item.totalValue > 0 ? fmtRON(item.totalValue) : "—"}</td>
              </tr>
            ))}
            <tr className="bg-[#1e3a5f]/5 font-bold border-t-2">
              <td className="px-2 py-1.5 font-bold" colSpan={2}>TOTAL</td>
              <td className="px-2 py-1.5">{fmtNum(items.reduce((s, i) => s + i.quantity, 0))}</td>
              <td className="px-2 py-1.5">{fmtRON(items.reduce((s, i) => s + i.totalValue, 0))}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── 2. Daily sales by category ───────────────────────────────────────────────

function DailySalesByCategoryTable({
  products, catMap, weekDays, prevProducts, loading,
}: {
  products: ProductSaleItem[]; catMap: Map<string, string>; weekDays: Date[];
  prevProducts: ProductSaleItem[]; loading: boolean;
}) {
  const dayIsos   = weekDays.map(d => toISO(d));
  const dayLabels = weekDays.map(d => capitalize(format(d, "EEE d", { locale: ro })));
  const daily     = buildDailyByCategory(products, catMap);
  const prevWeekly = buildWeeklyByCategory(prevProducts, catMap);

  const rows = Array.from(daily.entries()).map(([cat, days]) => {
    const dayQtys = dayIsos.map(iso => days.get(iso)?.qty ?? 0);
    const total   = dayQtys.reduce((s, v) => s + v, 0);
    const prev    = prevWeekly.get(cat)?.qty ?? 0;
    return { cat, dayQtys, total, prev };
  }).sort((a, b) => b.total - a.total);

  const totals = dayIsos.map((_, i) => rows.reduce((s, r) => s + r.dayQtys[i], 0));
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const grandPrev  = Array.from(prevWeekly.values()).reduce((s, v) => s + v.qty, 0);

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#2d6a4f] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">2. VÂNZĂRI ZILNICE (BUC.) – PE CATEGORII</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#2d6a4f]/10 border-b">
                <th className="text-left font-semibold text-[#2d6a4f] px-3 py-2">Categorie</th>
                {dayLabels.map(l => <th key={l} className="text-center font-semibold text-[#2d6a4f] px-2 py-2 whitespace-nowrap">{l}</th>)}
                <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2 whitespace-nowrap">Total săpt.</th>
                <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2 whitespace-nowrap">vs. săpt. prec.</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={dayLabels.length + 3} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={dayLabels.length + 3} className="px-3 py-4 text-center text-muted-foreground">Nicio vânzare în această perioadă</td></tr>
              ) : (
                <>
                  {rows.map(r => (
                    <tr key={r.cat} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-1.5 font-medium">{r.cat}</td>
                      {r.dayQtys.map((q, i) => <td key={i} className="px-2 py-1.5 text-center">{q > 0 ? fmtNum(q) : "—"}</td>)}
                      <td className="px-3 py-1.5 text-center font-bold">{r.total > 0 ? fmtNum(r.total) : "—"}</td>
                      <td className="px-3 py-1.5 text-center"><VariationBadge pct={pctChg(r.total, r.prev)} /></td>
                    </tr>
                  ))}
                  <tr className="bg-[#2d6a4f]/5 font-bold border-t-2">
                    <td className="px-3 py-2">TOTAL</td>
                    {totals.map((t, i) => <td key={i} className="px-2 py-2 text-center">{t > 0 ? fmtNum(t) : "—"}</td>)}
                    <td className="px-3 py-2 text-center">{fmtNum(grandTotal)}</td>
                    <td className="px-3 py-2 text-center"><VariationBadge pct={pctChg(grandTotal, grandPrev)} /></td>
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

// ─── 2B. Daily sales by product ───────────────────────────────────────────────

function DailySalesByProductTable({
  products, catMap, weekDays, prevProducts, loading,
}: {
  products: ProductSaleItem[]; catMap: Map<string, string>; weekDays: Date[];
  prevProducts: ProductSaleItem[]; loading: boolean;
}) {
  const dayIsos   = weekDays.map(d => toISO(d));
  const dayLabels = weekDays.map(d => capitalize(format(d, "EEE d", { locale: ro })));
  const rows      = buildDailyByProduct(products, catMap);
  const prevMap   = new Map(prevProducts.map(p => [p.productCode, p.quantity]));
  const totals    = dayIsos.map(iso => rows.reduce((s, r) => s + (r.days.get(iso)?.qty ?? 0), 0));
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const grandPrev  = prevProducts.filter(p => rows.some(r => r.code === p.productCode)).reduce((s, p) => s + p.quantity, 0);

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#2d6a4f] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">3. VÂNZĂRI ZILNICE – PE PRODUSE (TOP 15)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#2d6a4f]/10 border-b">
                <th className="text-left font-semibold text-[#2d6a4f] px-3 py-2">Produs</th>
                <th className="text-left font-semibold text-[#2d6a4f] px-3 py-2">Cat.</th>
                {dayLabels.map(l => <th key={l} className="text-center font-semibold text-[#2d6a4f] px-2 py-2 whitespace-nowrap">{l}</th>)}
                <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2">Total</th>
                <th className="text-center font-semibold text-[#2d6a4f] px-3 py-2">vs. prec.</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={dayLabels.length + 4} className="px-3 py-6 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={dayLabels.length + 4} className="px-3 py-4 text-center text-muted-foreground">Nicio vânzare în această perioadă</td></tr>
              ) : (
                <>
                  {rows.map(r => {
                    const prev = prevMap.get(r.code) ?? 0;
                    return (
                      <tr key={r.code} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-3 py-1.5 font-medium max-w-[180px]">
                          <p className="truncate" title={r.name}>{r.name}</p>
                        </td>
                        <td className="px-3 py-1.5 text-muted-foreground whitespace-nowrap">{r.cat}</td>
                        {dayIsos.map((iso, i) => {
                          const q = r.days.get(iso)?.qty ?? 0;
                          return <td key={i} className="px-2 py-1.5 text-center">{q > 0 ? fmtNum(q) : "—"}</td>;
                        })}
                        <td className="px-3 py-1.5 text-center font-bold">{fmtNum(r.total)}</td>
                        <td className="px-3 py-1.5 text-center"><VariationBadge pct={pctChg(r.total, prev)} /></td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#2d6a4f]/5 font-bold border-t-2">
                    <td className="px-3 py-2" colSpan={2}>TOTAL</td>
                    {totals.map((t, i) => <td key={i} className="px-2 py-2 text-center">{t > 0 ? fmtNum(t) : "—"}</td>)}
                    <td className="px-3 py-2 text-center">{fmtNum(grandTotal)}</td>
                    <td className="px-3 py-2 text-center"><VariationBadge pct={pctChg(grandTotal, grandPrev)} /></td>
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

// ─── 3. Weekly sales by category ─────────────────────────────────────────────

function WeeklySalesByCategoryTable({
  products, catMap, prevProducts, loading,
}: {
  products: ProductSaleItem[]; catMap: Map<string, string>;
  prevProducts: ProductSaleItem[]; loading: boolean;
}) {
  const cur  = buildWeeklyByCategory(products, catMap);
  const prev = buildWeeklyByCategory(prevProducts, catMap);
  const categories  = Array.from(new Set([...cur.keys(), ...prev.keys()]));
  const totalCurVal = Array.from(cur.values()).reduce((s, v) => s + v.val, 0);

  const grandCurQty  = Array.from(cur.values()).reduce((s, v) => s + v.qty, 0);
  const grandPrevQty = Array.from(prev.values()).reduce((s, v) => s + v.qty, 0);
  const grandCurVal  = totalCurVal;
  const grandPrevVal = Array.from(prev.values()).reduce((s, v) => s + v.val, 0);

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#1a4b8c] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">4. VÂNZĂRI SĂPTĂMÂNALE – PE CATEGORII</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a4b8c]/10 border-b">
                {["Categorie", "Buc. cur.", "Buc. prec.", "Val. cur. (RON)", "Val. prec. (RON)", "Var. %", "% din total"].map(h => (
                  <th key={h} className="text-left font-semibold text-[#1a4b8c] px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
              ) : (
                <>
                  {categories.map(cat => {
                    const c      = cur.get(cat)  ?? { qty: 0, val: 0, orders: 0 };
                    const p      = prev.get(cat) ?? { qty: 0, val: 0, orders: 0 };
                    const pctVal = totalCurVal > 0 ? ((c.val / totalCurVal) * 100).toFixed(1) + "%" : "—";
                    return (
                      <tr key={cat} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-3 py-1.5 font-medium">{cat}</td>
                        <td className="px-3 py-1.5">{c.qty > 0 ? fmtNum(c.qty) : "—"}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{p.qty > 0 ? fmtNum(p.qty) : "—"}</td>
                        <td className="px-3 py-1.5 font-semibold">{c.val > 0 ? fmtRON(c.val) : "—"}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{p.val > 0 ? fmtRON(p.val) : "—"}</td>
                        <td className="px-3 py-1.5"><VariationBadge pct={pctChg(c.val, p.val)} /></td>
                        <td className="px-3 py-1.5 font-semibold text-[#1a4b8c]">{pctVal}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#1a4b8c]/5 font-bold border-t-2">
                    <td className="px-3 py-2">TOTAL</td>
                    <td className="px-3 py-2">{grandCurQty > 0 ? fmtNum(grandCurQty) : "—"}</td>
                    <td className="px-3 py-2">{grandPrevQty > 0 ? fmtNum(grandPrevQty) : "—"}</td>
                    <td className="px-3 py-2">{grandCurVal > 0 ? fmtRON(grandCurVal) : "—"}</td>
                    <td className="px-3 py-2">{grandPrevVal > 0 ? fmtRON(grandPrevVal) : "—"}</td>
                    <td className="px-3 py-2"><VariationBadge pct={pctChg(grandCurVal, grandPrevVal)} /></td>
                    <td className="px-3 py-2">100%</td>
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

// ─── 5. Calls by channel ──────────────────────────────────────────────────────

function CallsByChannelTable({ calls, loading }: { calls: CallsData | null; loading: boolean }) {
  const ch  = calls?.channels         ?? { facebook: 0, tiktok: 0, google: 0 };
  const cha = calls?.channelsAnswered  ?? { facebook: 0, tiktok: 0, google: 0 };
  const totalKnown   = ch.facebook  + ch.tiktok  + ch.google;
  const answeredKnown = cha.facebook + cha.tiktok + cha.google;
  const organicTotal   = Math.max(0, (calls?.total    ?? 0) - totalKnown);
  const organicAnswered = Math.max(0, (calls?.answered ?? 0) - answeredKnown);

  const rows = [
    { canal: "Facebook Ads", total: ch.facebook,  answered: cha.facebook  },
    { canal: "TikTok Ads",   total: ch.tiktok,    answered: cha.tiktok    },
    { canal: "Google Ads",   total: ch.google,    answered: cha.google    },
    { canal: "Organic / Direct", total: organicTotal, answered: organicAnswered },
  ];

  const grandTotal   = calls?.total    ?? 0;
  const grandAnswered = calls?.answered ?? 0;
  const grandRate    = grandTotal > 0 ? (grandAnswered / grandTotal) * 100 : null;

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#5c2d8c] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">5. APELURI (PE CANAL)</CardTitle>
        <p className="text-[11px] text-white/70 mt-0.5">Distribuția apelurilor primite pe canalul de proveniență · săptămâna curentă</p>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#5c2d8c]/10 border-b">
              {["Canal", "Apeluri totale", "Apeluri răspunse", "Lead-uri calificate", "Rată conversie"].map(h => (
                <th key={h} className="text-left font-semibold text-[#5c2d8c] px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
            ) : (
              <>
                {rows.map(r => {
                  const rate = r.total > 0 ? ((r.answered / r.total) * 100).toFixed(1) + "%" : "—";
                  return (
                    <tr key={r.canal} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium">{r.canal}</td>
                      <td className="px-3 py-2 font-semibold">{r.total > 0 ? fmtNum(r.total) : "—"}</td>
                      <td className="px-3 py-2">{r.answered > 0 ? fmtNum(r.answered) : "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">—</td>
                      <td className="px-3 py-2 font-semibold text-[#5c2d8c]">{rate}</td>
                    </tr>
                  );
                })}
                <tr className="bg-[#5c2d8c]/5 font-bold border-t-2">
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2">{grandTotal > 0 ? fmtNum(grandTotal) : "—"}</td>
                  <td className="px-3 py-2">{grandAnswered > 0 ? fmtNum(grandAnswered) : "—"}</td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2">{grandRate !== null ? grandRate.toFixed(1) + "%" : "—"}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── 5. MarketingInvestmentCard ───────────────────────────────────────────────

function MarketingInvestmentCard({ metrics, prevMetrics, totalSpend, prevSpend, monthRevenue, monthSpend, loading }: {
  metrics: MetricsData | null; prevMetrics: MetricsData | null;
  totalSpend: number; prevSpend: number;
  monthRevenue: number; monthSpend: number;
  loading: boolean;
}) {
  const ca        = metrics?.incasate.total     ?? 0;
  const prevCa    = prevMetrics?.incasate.total ?? 0;
  const pondCur   = ca > 0          ? (totalSpend  / ca)          * 100 : 0;
  const pondPrev  = prevCa > 0      ? (prevSpend   / prevCa)      * 100 : 0;
  const pondMonth = monthRevenue > 0 ? (monthSpend  / monthRevenue) * 100 : 0;
  const delta     = pondCur > 0 && pondPrev > 0 ? +(pondCur - pondPrev).toFixed(1) : null;

  const rows = [
    { label: "Cifra de afaceri (săpt. curentă)",                 value: ca > 0 ? fmtRON(ca) : "—" },
    { label: "Investiție totală marketing (toate canalele)",      value: totalSpend > 0 ? fmtRON(totalSpend) : "—" },
    { label: "Pondere investiție marketing din cifra de afaceri", value: pondCur > 0 ? `${pondCur.toFixed(1)}%` : "—" },
    { label: "Săptămâna precedentă",                             value: pondPrev > 0 ? `${pondPrev.toFixed(1)}%` : "—" },
    { label: "Luna curentă (invest. / CA lunară)",               value: pondMonth > 0 ? `${pondMonth.toFixed(1)}%` : "—" },
    {
      label: "Variație săpt. (puncte procentuale)",
      value: delta !== null
        ? <span className={delta > 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
            {delta > 0 ? "▲" : "▼"} {Math.abs(delta)} pp
          </span>
        : "—",
    },
  ];

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="rounded-t-lg bg-[#c0392b] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">6. INVESTIȚIE MARKETING VS. CIFRA DE AFACERI</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4">
        {loading ? <p className="text-sm text-muted-foreground py-4 text-center">Se încarcă...</p> : (
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
  canal: string; spend: number; calls: number; costPerCall: number | null;
  leads: number; cpl: number | null; conversions: number; costPerConv: number | null;
  revenue: number; roas: number | null;
}

function ChannelPerformanceTable({ rows, loading }: { rows: ChannelRow[]; loading: boolean }) {
  const tot = rows.reduce((acc, r) => ({
    ...acc, spend: acc.spend + r.spend, calls: acc.calls + r.calls,
    conversions: acc.conversions + r.conversions, revenue: acc.revenue + r.revenue,
  }), { spend: 0, calls: 0, conversions: 0, revenue: 0 });

  return (
    <Card className="shadow-xs">
      <CardHeader className="rounded-t-lg bg-[#2c3e50] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">7. MARKETING – PERFORMANȚĂ CANALE (TOTAL)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#2c3e50]/10 border-b">
              {["Canal", "Spend (RON)", "Apeluri", "Cost / apel", "Comenzi", "Vânzări (RON)", "% din CA"].map(h => (
                <th key={h} className="text-left font-semibold text-[#2c3e50] px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">Se încarcă...</td></tr>
            ) : (
              <>
                {rows.map(r => {
                  const pctCA = r.revenue > 0 && r.spend > 0 ? ((r.spend / r.revenue) * 100).toFixed(1) + "%" : "—";
                  return (
                    <tr key={r.canal} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium">{r.canal}</td>
                      <td className="px-3 py-2">{r.spend > 0 ? fmtRON(r.spend) : "—"}</td>
                      <td className="px-3 py-2">{r.calls > 0 ? fmtNum(r.calls) : "—"}</td>
                      <td className="px-3 py-2">{r.costPerCall !== null ? fmtRON(r.costPerCall) : "—"}</td>
                      <td className="px-3 py-2 font-semibold">{r.conversions > 0 ? fmtNum(r.conversions) : "—"}</td>
                      <td className="px-3 py-2 font-semibold text-green-700 dark:text-green-400">{r.revenue > 0 ? fmtRON(r.revenue) : "—"}</td>
                      <td className="px-3 py-2 font-semibold text-[#2c3e50]">{pctCA}</td>
                    </tr>
                  );
                })}
                <tr className="bg-[#2c3e50]/5 font-bold border-t-2">
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2">{tot.spend > 0 ? fmtRON(tot.spend) : "—"}</td>
                  <td className="px-3 py-2">{tot.calls > 0 ? fmtNum(tot.calls) : "—"}</td>
                  <td className="px-3 py-2">{tot.calls > 0 && tot.spend > 0 ? fmtRON(tot.spend / tot.calls) : "—"}</td>
                  <td className="px-3 py-2">{tot.conversions > 0 ? fmtNum(tot.conversions) : "—"}</td>
                  <td className="px-3 py-2">{tot.revenue > 0 ? fmtRON(tot.revenue) : "—"}</td>
                  <td className="px-3 py-2">{tot.revenue > 0 && tot.spend > 0 ? ((tot.spend / tot.revenue) * 100).toFixed(1) + "%" : "—"}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── 7. NotesCard ─────────────────────────────────────────────────────────────

function NotesCard({ stockItems, products, catMap, prevProducts, channelRows, metrics, prevMetrics, loading }: {
  stockItems: StockItem[]; products: ProductSaleItem[]; catMap: Map<string, string>;
  prevProducts: ProductSaleItem[]; channelRows: ChannelRow[];
  metrics: MetricsData | null; prevMetrics: MetricsData | null; loading: boolean;
}) {
  const notes: { text: string; type: "good" | "warn" | "bad" | "info" }[] = [];
  if (!loading) {
    const ca   = metrics?.incasate.total ?? 0;
    const prev = prevMetrics?.incasate.total ?? 0;
    const pct  = pctChg(ca, prev);
    if (pct !== null && pct > 0)  notes.push({ text: `Vânzări săptămânale +${pct}% față de săptămâna precedentă (${fmtRON(ca)}).`, type: "good" });
    if (pct !== null && pct < 0)  notes.push({ text: `Scădere vânzări ${pct}% față de săptămâna precedentă. Analizați cauzele.`, type: "bad" });

    const cur  = buildWeeklyByCategory(products, catMap);
    const prevW = buildWeeklyByCategory(prevProducts, catMap);
    for (const [cat, cData] of cur.entries()) {
      const pData = prevW.get(cat);
      if (!pData || pData.qty === 0) continue;
      const p = pctChg(cData.qty, pData.qty);
      if (p !== null && p >= 20)  notes.push({ text: `Creștere vânzări ${cat}: +${p}% față de săptămâna precedentă.`, type: "good" });
      if (p !== null && p <= -20) notes.push({ text: `Scădere vânzări ${cat}: ${p}%. Verificați stocul și bugetul de marketing.`, type: "bad" });
    }

    const lowStock = stockItems.filter(i => i.status === "low_stock" || (i.status === "in_stock" && i.quantity <= 2));
    if (lowStock.length > 0)
      notes.push({ text: `Stoc redus: ${lowStock.slice(0, 3).map(i => i.name).join(", ")}${lowStock.length > 3 ? ` +${lowStock.length - 3} altele` : ""}.`, type: "warn" });

    const best = channelRows.filter(r => r.roas !== null && r.roas > 0).sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    if (best?.roas && best.roas >= 8)
      notes.push({ text: `ROAS ${best.canal}: ${best.roas.toFixed(2)}x — performanță excelentă.`, type: "good" });
    const worst = channelRows.filter(r => r.roas !== null && r.roas > 0 && r.spend > 0).sort((a, b) => (a.roas ?? 0) - (b.roas ?? 0))[0];
    if (worst?.roas && worst.roas < 3)
      notes.push({ text: `ROAS scăzut pe ${worst.canal} (${worst.roas.toFixed(2)}x) — optimizare necesară.`, type: "bad" });

    if (notes.length === 0) notes.push({ text: "Nicio anomalie detectată. Continuați monitorizarea.", type: "info" });
  }

  const typeStyle = { good: "bg-green-50 text-green-800 border-green-200", warn: "bg-yellow-50 text-yellow-800 border-yellow-200", bad: "bg-red-50 text-red-800 border-red-200", info: "bg-blue-50 text-blue-800 border-blue-200" };
  const typeIcon  = { good: <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />, warn: <Package className="h-3.5 w-3.5 flex-shrink-0" />, bad: <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" />, info: <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" /> };

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="rounded-t-lg bg-[#b8860b] text-white pb-3 pt-3 px-4">
        <CardTitle className="text-sm font-bold tracking-wide">8. OBSERVAȚII / NOTE</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4">
        {loading ? <p className="text-sm text-muted-foreground py-4 text-center">Se generează...</p> : (
          <ul className="flex flex-col gap-2">
            {notes.map((n, i) => (
              <li key={i} className={`flex items-start gap-2 text-xs px-2.5 py-2 rounded border ${typeStyle[n.type]}`}>
                {typeIcon[n.type]}<span>{n.text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Category filter bar ──────────────────────────────────────────────────────

const STORAGE_KEY = "raport-mktg-excluded-cats";

function CategoryFilterBar({
  all, excluded, onToggle, onSelectAll, onSelectNone,
}: {
  all: string[];
  excluded: Set<string>;
  onToggle: (cat: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
  if (all.length === 0) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap bg-muted/40 rounded-lg px-3 py-2.5 border">
      <span className="text-xs font-semibold text-muted-foreground shrink-0">Categorii vizibile:</span>
      <button
        onClick={onSelectAll}
        className="text-xs px-2 py-0.5 rounded border border-primary/40 hover:bg-primary/10 text-primary font-medium transition-colors"
      >
        Toate
      </button>
      <button
        onClick={onSelectNone}
        className="text-xs px-2 py-0.5 rounded border border-muted-foreground/30 hover:bg-muted text-muted-foreground font-medium transition-colors"
      >
        Niciuna
      </button>
      <div className="h-4 w-px bg-border shrink-0" />
      {all.map(cat => {
        const isActive = !excluded.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            title={isActive ? `Ascunde „${cat}"` : `Afișează „${cat}"`}
            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium transition-all ${
              isActive
                ? cat === "Necategorizat"
                  ? "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300"
                  : "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300"
                : "bg-muted text-muted-foreground border-muted-foreground/20 opacity-40 line-through"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main RenderPage ──────────────────────────────────────────────────────────

export default function RenderPage() {
  const now     = new Date();
  const curWeek = getWeekRange(now);
  const prevWeek = getWeekRange(subWeeks(now, 1));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(curWeek.from, i));

  const [stockItems,      setStockItems]      = useState<StockItem[]>([]);
  const [curProducts,     setCurProducts]     = useState<ProductSaleItem[]>([]);
  const [prevProducts,    setPrevProducts]    = useState<ProductSaleItem[]>([]);
  const [metrics,         setMetrics]         = useState<MetricsData | null>(null);
  const [prevMetrics,     setPrevMetrics]     = useState<MetricsData | null>(null);
  const [calls,           setCalls]           = useState<CallsData | null>(null);
  const [attribution,     setAttribution]     = useState<AttributionData | null>(null);
  const [fbAds,           setFbAds]           = useState<AdsData>({ spend: 0, impressions: 0, clicks: 0, conversions: 0 });
  const [gAds,            setGAds]            = useState<AdsData>({ spend: 0, impressions: 0, clicks: 0, conversions: 0 });
  const [ttAds,           setTtAds]           = useState<AdsData>({ spend: 0, impressions: 0, clicks: 0, conversions: 0 });
  const [prevTotalSpend,  setPrevTotalSpend]  = useState(0);
  const [monthRevenue,    setMonthRevenue]    = useState(0);
  const [monthSpend,      setMonthSpend]      = useState(0);
  const [loading,         setLoading]         = useState(true);

  // ── Category filter (persisted in localStorage) ────────────────────────────
  const [excluded, setExcluded] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {}
    return new Set<string>();
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const cf = toISO(curWeek.from),  ct = toISO(curWeek.to);
    const pf = toISO(prevWeek.from), pt = toISO(prevWeek.to);
    const mf = toISO(new Date(now.getFullYear(), now.getMonth(), 1));
    const mt = toISO(now);

    const [
      stockRes, metricsRes, prevMetricsRes, callsRes, attrRes,
      fbRes, gRes, ttRes, prevFbRes, prevGRes, prevTtRes,
      curSalesRes, prevSalesRes,
      monthMetricsRes, monthFbRes, monthGRes, monthTtRes,
    ] = await Promise.allSettled([
      fetch("/api/stock",                                                                             { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/metrics?from=${cf}&to=${ct}`,                                               { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/metrics?from=${pf}&to=${pt}`,                                               { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/crm/calls?counts=1&from=${cf}&to=${ct}`,                                            { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/attribution?from=${cf}&to=${ct}`,                                           { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${cf}&to=${ct}`,                         { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/google-ads/campaigns?from=${cf}&to=${ct}`,                                          { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${cf}&to=${ct}`,                                          { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${pf}&to=${pt}`,                         { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/google-ads/campaigns?from=${pf}&to=${pt}`,                                          { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${pf}&to=${pt}`,                                          { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/smartbill/product-sales?from=${cf}&to=${ct}`,                                       { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/smartbill/product-sales?from=${pf}&to=${pt}`,                                       { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/finance/metrics?from=${mf}&to=${mt}`,                                               { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/education/facebook-ads?level=campaign&from=${mf}&to=${mt}`,                         { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/google-ads/campaigns?from=${mf}&to=${mt}`,                                          { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/tiktok-ads/campaigns?from=${mf}&to=${mt}`,                                          { cache: "no-store" }).then(r => r.json()),
    ]);

    if (stockRes.status      === "fulfilled") setStockItems((stockRes.value as { items: StockItem[] }).items ?? []);
    if (metricsRes.status    === "fulfilled") setMetrics(metricsRes.value as MetricsData);
    if (prevMetricsRes.status === "fulfilled") setPrevMetrics(prevMetricsRes.value as MetricsData);
    if (callsRes.status      === "fulfilled") setCalls(callsRes.value as CallsData);
    if (attrRes.status       === "fulfilled") setAttribution(attrRes.value as AttributionData);
    if (curSalesRes.status   === "fulfilled") setCurProducts((curSalesRes.value as { products: ProductSaleItem[] }).products ?? []);
    if (prevSalesRes.status  === "fulfilled") setPrevProducts((prevSalesRes.value as { products: ProductSaleItem[] }).products ?? []);

    const parseFb = (v: unknown): AdsData => {
      const rows: Record<string, unknown>[] = Array.isArray(v) ? v : Array.isArray((v as Record<string, unknown>)?.campaigns) ? (v as Record<string, unknown[]>).campaigns as Record<string, unknown>[] : Array.isArray((v as Record<string, unknown>)?.data) ? (v as Record<string, unknown[]>).data as Record<string, unknown>[] : [];
      return { spend: rows.reduce((s, r) => s + (Number(r.spend) || 0), 0), impressions: rows.reduce((s, r) => s + (Number(r.impressions) || 0), 0), clicks: rows.reduce((s, r) => s + (Number(r.clicks) || 0), 0), conversions: rows.reduce((s, r) => s + (Number(r.conversions) || 0), 0) };
    };
    const parseG = (v: unknown): AdsData => { const d = v as Record<string, Record<string, number>> | null; return { spend: d?.overview?.spend ?? 0, impressions: d?.overview?.impressions ?? 0, clicks: d?.overview?.clicks ?? 0, conversions: d?.overview?.conversions ?? 0 }; };
    const parseTt = (v: unknown): AdsData => { const d = (v && !(v as Record<string, unknown>).error) ? v as Record<string, Record<string, number>> : null; return { spend: d?.overview?.spend ?? 0, impressions: d?.overview?.impressions ?? 0, clicks: d?.overview?.clicks ?? 0, conversions: d?.overview?.conversions ?? 0 }; };

    const fb  = fbRes.status  === "fulfilled" ? parseFb(fbRes.value)  : { spend: 0, impressions: 0, clicks: 0, conversions: 0 };
    const g   = gRes.status   === "fulfilled" ? parseG(gRes.value)    : { spend: 0, impressions: 0, clicks: 0, conversions: 0 };
    const tt  = ttRes.status  === "fulfilled" ? parseTt(ttRes.value)  : { spend: 0, impressions: 0, clicks: 0, conversions: 0 };
    setFbAds(fb); setGAds(g); setTtAds(tt);

    const pFb = prevFbRes.status === "fulfilled" ? parseFb(prevFbRes.value).spend : 0;
    const pG  = prevGRes.status  === "fulfilled" ? parseG(prevGRes.value).spend   : 0;
    const pTt = prevTtRes.status === "fulfilled" ? parseTt(prevTtRes.value).spend  : 0;
    setPrevTotalSpend(pFb + pG + pTt);

    const mFb = monthFbRes.status === "fulfilled" ? parseFb(monthFbRes.value).spend : 0;
    const mG  = monthGRes.status  === "fulfilled" ? parseG(monthGRes.value).spend   : 0;
    const mTt = monthTtRes.status === "fulfilled" ? parseTt(monthTtRes.value).spend : 0;
    setMonthSpend(mFb + mG + mTt);
    if (monthMetricsRes.status === "fulfilled")
      setMonthRevenue((monthMetricsRes.value as MetricsData)?.incasate?.total ?? 0);

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Derived ────────────────────────────────────────────────────────────────

  const catMap = useMemo(() => buildCategoryMap(stockItems), [stockItems]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>(["Necategorizat"]);
    for (const i of stockItems) if (i.category) cats.add(i.category);
    return Array.from(cats).sort((a, b) =>
      a === "Necategorizat" ? 1 : b === "Necategorizat" ? -1 : a.localeCompare(b, "ro")
    );
  }, [stockItems]);

  const toggleCategory = (cat: string) =>
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });

  const filteredStockItems = useMemo(
    () => stockItems.filter(i => !excluded.has(i.category ?? "Necategorizat")),
    [stockItems, excluded]
  );
  const filteredCurProducts = useMemo(
    () => curProducts.filter(p => !excluded.has(catMap.get(p.productCode) ?? "Necategorizat")),
    [curProducts, catMap, excluded]
  );
  const filteredPrevProducts = useMemo(
    () => prevProducts.filter(p => !excluded.has(catMap.get(p.productCode) ?? "Necategorizat")),
    [prevProducts, catMap, excluded]
  );
  const totalSpend      = fbAds.spend + gAds.spend + ttAds.spend;
  const totalRevenue    = metrics?.incasate.total ?? 0;
  const prevRevenue     = prevMetrics?.incasate.total ?? 0;
  const totalCalls      = calls?.total    ?? 0;
  const totalAnswered   = calls?.answered ?? 0;
  const attrCur         = attribution ?? { facebook: { conversions: 0, revenue: 0 }, tiktok: { conversions: 0, revenue: 0 }, google: { conversions: 0, revenue: 0 } };
  const totalConversions = attrCur.facebook.conversions + attrCur.tiktok.conversions + attrCur.google.conversions;
  const convRate        = totalAnswered > 0 ? (totalConversions / totalAnswered) * 100 : 0;
  const investPct       = totalRevenue  > 0 ? (totalSpend / totalRevenue) * 100        : 0;

  const attrRoas = (sp: number, rev: number) => sp > 0 && rev > 0 ? +(rev / sp).toFixed(2) : null;
  const channelRows: ChannelRow[] = [
    { canal: "Facebook Ads", spend: fbAds.spend, calls: calls?.channels.facebook ?? 0, costPerCall: calls?.channelsAnswered.facebook && fbAds.spend > 0 ? +(fbAds.spend / calls.channelsAnswered.facebook).toFixed(2) : null, leads: calls?.channels.facebook ?? 0, cpl: calls?.channels.facebook && fbAds.spend > 0 ? +(fbAds.spend / calls.channels.facebook).toFixed(2) : null, conversions: attrCur.facebook.conversions, costPerConv: attrCur.facebook.conversions > 0 && fbAds.spend > 0 ? +(fbAds.spend / attrCur.facebook.conversions).toFixed(2) : null, revenue: attrCur.facebook.revenue, roas: attrRoas(fbAds.spend, attrCur.facebook.revenue) },
    { canal: "TikTok Ads",   spend: ttAds.spend, calls: calls?.channels.tiktok   ?? 0, costPerCall: calls?.channelsAnswered.tiktok   && ttAds.spend > 0 ? +(ttAds.spend / calls.channelsAnswered.tiktok).toFixed(2)   : null, leads: calls?.channels.tiktok   ?? 0, cpl: calls?.channels.tiktok   && ttAds.spend > 0 ? +(ttAds.spend / calls.channels.tiktok).toFixed(2)   : null, conversions: attrCur.tiktok.conversions,   costPerConv: attrCur.tiktok.conversions   > 0 && ttAds.spend > 0 ? +(ttAds.spend / attrCur.tiktok.conversions).toFixed(2)   : null, revenue: attrCur.tiktok.revenue,   roas: attrRoas(ttAds.spend, attrCur.tiktok.revenue)   },
    { canal: "Google Ads",   spend: gAds.spend,  calls: calls?.channels.google   ?? 0, costPerCall: calls?.channelsAnswered.google   && gAds.spend  > 0 ? +(gAds.spend  / calls.channelsAnswered.google).toFixed(2)   : null, leads: calls?.channels.google   ?? 0, cpl: calls?.channels.google   && gAds.spend  > 0 ? +(gAds.spend  / calls.channels.google).toFixed(2)   : null, conversions: attrCur.google.conversions,   costPerConv: attrCur.google.conversions   > 0 && gAds.spend  > 0 ? +(gAds.spend  / attrCur.google.conversions).toFixed(2)   : null, revenue: attrCur.google.revenue,   roas: attrRoas(gAds.spend,  attrCur.google.revenue)   },
    { canal: "Organic / Direct", spend: 0, calls: 0, costPerCall: null, leads: 0, cpl: null, conversions: 0, costPerConv: null, revenue: 0, roas: null },
  ];

  const kpis = [
    { label: "Vânzări săptămânale", value: loading ? "—" : fmtRON(totalRevenue), sub: "Venituri încasate", icon: <Banknote className="h-5 w-5" />, accent: "border-t-blue-600", pct: pctChg(totalRevenue, prevRevenue) },
    { label: "Apeluri totale",      value: loading ? "—" : fmtNum(totalCalls),    sub: `Răspunse: ${fmtNum(totalAnswered)}`, icon: <Phone className="h-5 w-5" />, accent: "border-t-orange-500", pct: null },
    { label: "Comenzi plasate",     value: loading ? "—" : fmtNum(totalConversions), sub: "Conversii atribuite", icon: <ShoppingCart className="h-5 w-5" />, accent: "border-t-green-600", pct: null },
    { label: "Rată conversie apeluri → comenzi", value: loading ? "—" : convRate > 0 ? `${convRate.toFixed(1)}%` : "—", sub: "Răspunse → factură achitată", icon: <Percent className="h-5 w-5" />, accent: "border-t-purple-600", pct: null },
    { label: "Investiție marketing / CA", value: loading ? "—" : investPct > 0 ? `${investPct.toFixed(1)}%` : "—", sub: totalSpend > 0 ? fmtRON(totalSpend) : "—", icon: <BarChart3 className="h-5 w-5" />, accent: "border-t-red-500", pct: null, invertPct: true },
  ];

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="rounded-xl border bg-gradient-to-r from-[#0f2a4a] to-[#1a4b8c] text-white px-6 py-5">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-1">Dashboard săptămânal</p>
        <h1 className="text-2xl font-black tracking-tight">RETROSPECTIVĂ SĂPTĂMÂNALĂ – MARKETING</h1>
        <div className="mt-2 flex flex-col sm:flex-row gap-3 text-xs opacity-80">
          <span><b>Săptămâna:</b> {capitalize(weekLabel(curWeek.from, curWeek.to))}</span>
          <span><b>Data raport:</b> {capitalize(format(now, "d MMMM yyyy (EEEE)", { locale: ro }))}</span>
        </div>
      </div>

      {/* Category filter bar */}
      <CategoryFilterBar
        all={allCategories}
        excluded={excluded}
        onToggle={toggleCategory}
        onSelectAll={() => { setExcluded(new Set()); try { localStorage.setItem(STORAGE_KEY, "[]"); } catch {} }}
        onSelectNone={() => { setExcluded(new Set(allCategories)); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories)); } catch {} }}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Stock (left) + Daily + Weekly sales (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-2"><ProductStockTable items={filteredStockItems} loading={loading} /></div>
        <div className="lg:col-span-3 flex flex-col gap-4">
          <DailySalesByCategoryTable products={filteredCurProducts} catMap={catMap} weekDays={weekDays} prevProducts={filteredPrevProducts} loading={loading} />
          <DailySalesByProductTable  products={filteredCurProducts} catMap={catMap} weekDays={weekDays} prevProducts={filteredPrevProducts} loading={loading} />
          <WeeklySalesByCategoryTable products={filteredCurProducts} catMap={catMap} prevProducts={filteredPrevProducts} loading={loading} />
        </div>
      </div>

      {/* Calls by channel + Marketing investment */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <CallsByChannelTable calls={calls} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <MarketingInvestmentCard metrics={metrics} prevMetrics={prevMetrics} totalSpend={totalSpend} prevSpend={prevTotalSpend} monthRevenue={monthRevenue} monthSpend={monthSpend} loading={loading} />
        </div>
      </div>

      {/* Channel performance + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <ChannelPerformanceTable rows={channelRows} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <NotesCard stockItems={filteredStockItems} products={filteredCurProducts} catMap={catMap} prevProducts={filteredPrevProducts} channelRows={channelRows} metrics={metrics} prevMetrics={prevMetrics} loading={loading} />
        </div>
      </div>
    </div>
  );
}
