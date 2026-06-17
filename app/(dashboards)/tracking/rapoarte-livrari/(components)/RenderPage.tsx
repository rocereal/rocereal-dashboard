"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Truck, Fuel, MapPin, TrendingUp, AlertTriangle,
  Package, Route, DollarSign, Users, ChevronDown, ChevronRight,
  Map, BarChart2,
} from "lucide-react";
import { RomaniaMap } from "./RomaniaMap";
import type {
  DeliveryReport, EnrichedDelivery, VehicleSummary,
  DriverStats, CountyStats, MonthlyTrend,
} from "@/lib/deliveryCostCalculator";
import type { InvoiceProduct } from "@/app/api/tracking/invoice-products/route";

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number, d = 0) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
const pct = (a: number, b: number) => b > 0 ? ((a / b) * 100).toFixed(1) + "%" : "—";

const MONTHS_RO = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Noi","Dec"];

// ─── Status ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  efficient:  "bg-green-50 text-green-700 border-green-200",
  covered:    "bg-blue-50 text-blue-700 border-blue-200",
  high_cost:  "bg-orange-50 text-orange-700 border-orange-200",
  subsidized: "bg-red-50 text-red-700 border-red-200",
  incomplete: "bg-gray-50 text-gray-500 border-gray-200",
};

function StatusBadge({ status, label }: { status: string; label: string }) {
  return <Badge variant="outline" className={`text-xs ${STATUS_STYLE[status] ?? ""}`}>{label}</Badge>;
}

// ─── KpiCard (raport-anual style) ─────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string;
  icon?: React.ReactNode; accent?: string;
}) {
  return (
    <Card className={`shadow-xs border-t-4 ${accent ?? "border-t-primary"}`}>
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </CardTitle>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
      </CardHeader>
      {sub && (
        <CardContent className="pt-0 pb-3 px-4">
          <p className="text-xs text-muted-foreground">{sub}</p>
        </CardContent>
      )}
    </Card>
  );
}

// ─── SectionHeader (raport-anual style) ───────────────────────────────────────

function SectionHeader({ n, title, color = "#1e3a5f" }: {
  n: string; title: string; color?: string;
}) {
  return (
    <CardHeader
      className="rounded-t-lg text-white pb-3 pt-3 px-4"
      style={{ backgroundColor: color }}
    >
      <CardTitle className="text-sm font-bold tracking-wide">{n}. {title}</CardTitle>
    </CardHeader>
  );
}

// ─── Deviation badge ──────────────────────────────────────────────────────────

function DeviationBadge({ dev }: { dev: number | null }) {
  if (dev === null) return <span className="text-xs text-muted-foreground">—</span>;
  const absP = Math.abs(Math.round(dev * 100));
  if (absP <= 15) return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">±{absP}%</Badge>;
  if (dev > 0)    return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">+{absP}%</Badge>;
  return             <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">-{absP}%</Badge>;
}

// ─── Invoice products row ─────────────────────────────────────────────────────

function InvoiceProductsCell({ invoiceNumber }: { invoiceNumber: string }) {
  const [products, setProducts] = useState<InvoiceProduct[] | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [open,     setOpen]     = useState(false);

  const load = useCallback(async () => {
    if (products !== null) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/tracking/invoice-products?invoice=${invoiceNumber}`);
      const data = await res.json() as { products?: InvoiceProduct[] };
      setProducts(data.products ?? []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [invoiceNumber, products]);

  const toggle = () => {
    if (!open) load();
    setOpen(o => !o);
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {invoiceNumber}
      </button>
      {open && (
        <div className="mt-1 p-2 bg-muted/50 rounded text-xs space-y-0.5">
          {loading && <span className="text-muted-foreground">Se încarcă...</span>}
          {!loading && products?.length === 0 && <span className="text-muted-foreground">Fără produse</span>}
          {!loading && products?.map((p, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span className="text-foreground">{p.quantity} {p.um} × {p.name}</span>
              <span className="font-medium whitespace-nowrap">{fmtRON(p.totalPrice)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delivery table ───────────────────────────────────────────────────────────

function DeliveriesTable({ rows }: { rows: EnrichedDelivery[] }) {
  const [page, setPage] = useState(0);
  const PER = 30;
  const sliced = rows.slice(page * PER, (page + 1) * PER);

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="text-xs">Data</TableHead>
            <TableHead className="text-xs">Vehicul</TableHead>
            <TableHead className="text-xs">Șofer</TableHead>
            <TableHead className="text-xs">Rută</TableHead>
            <TableHead className="text-right text-xs">Km foaie</TableHead>
            <TableHead className="text-right text-xs">Km calc.</TableHead>
            <TableHead className="text-xs">Deviere</TableHead>
            <TableHead className="text-right text-xs">Cost log.</TableHead>
            <TableHead className="text-right text-xs">Achitat</TableHead>
            <TableHead className="text-xs">Factură / Produse</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliced.map((d, i) => (
            <TableRow key={`${d.sourceSheet}-${d.rowNumber}-${i}`} className="hover:bg-muted/20">
              <TableCell className="text-xs whitespace-nowrap">{d.date}</TableCell>
              <TableCell className="text-xs font-mono font-semibold">{d.vehicleNumber}</TableCell>
              <TableCell className="text-xs">{d.driver || "—"}</TableCell>
              <TableCell className="text-xs max-w-[160px]">
                <span className="text-muted-foreground">{d.departureLocation || "—"}</span>
                <span className="mx-1">→</span>
                <span className="font-medium">{d.arrivalLocation || "—"}</span>
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">
                {d.totalKm > 0 ? fmtNum(d.totalKm) : "—"}
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                {d.calculatedKm ? `~${fmtNum(d.calculatedKm)}` : "—"}
              </TableCell>
              <TableCell><DeviationBadge dev={d.kmDeviation} /></TableCell>
              <TableCell className="text-right text-xs tabular-nums font-semibold">
                {fmtRON(d.logisticCost)}
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">
                {d.amountPaidByClient > 0 ? fmtRON(d.amountPaidByClient) : "—"}
              </TableCell>
              <TableCell className="text-xs min-w-[130px]">
                {d.invoiceNumber
                  ? <InvoiceProductsCell invoiceNumber={d.invoiceNumber} />
                  : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                <StatusBadge status={d.efficiencyStatus} label={d.efficiencyLabel} />
              </TableCell>
            </TableRow>
          ))}
          {sliced.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-muted-foreground py-10">
                Nu există livrări în această perioadă.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rows.length > PER && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 py-1">
          <span>{page * PER + 1}–{Math.min((page + 1) * PER, rows.length)} din {rows.length}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-muted">
              ← Anterior
            </button>
            <button disabled={(page + 1) * PER >= rows.length} onClick={() => setPage(p => p + 1)}
              className="px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-muted">
              Următor →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RenderPage() {
  const currentYear = new Date().getFullYear();
  const [year,    setYear]    = useState(currentYear);
  const [data,    setData]    = useState<DeliveryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<"deliveries" | "km" | "cost">("deliveries");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const from = `${year}-01-01`;
      const to   = `${year}-12-31`;
      const res  = await fetch(`/api/tracking/deliveries?from=${from}&to=${to}`, { cache: "no-store" });
      const json = await res.json() as DeliveryReport & { error?: string };
      if (json.error) { setError(json.error); setData(null); }
      else setData(json);
    } catch { setError("Nu s-au putut încărca datele."); }
    finally { setLoading(false); }
  }, [year]);

  useEffect(() => { load(); }, [load]);

  const kpis = data?.kpis;

  const deliveriesWithCalc = useMemo(
    () => data?.enrichedDeliveries.filter(d => d.calculatedKm !== null) ?? [],
    [data],
  );
  const avgDeviation = useMemo(() => {
    const valid = deliveriesWithCalc.filter(d => d.kmDeviation !== null);
    if (!valid.length) return null;
    return valid.reduce((s, d) => s + (d.kmDeviation ?? 0), 0) / valid.length;
  }, [deliveriesWithCalc]);

  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // Monthly trend data for recharts
  const monthlyChart = useMemo(() =>
    (data?.monthlyTrends ?? []).map((m: MonthlyTrend) => ({
      ...m,
      label: MONTHS_RO[(m.month - 1)] ?? String(m.month),
    })),
  [data]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Rapoarte Livrări"
        subtitle="Analiză livrări, rute și costuri logistice"
        breadcrumbs={[
          { label: "Tracking Mașini", href: "/tracking" },
          { label: "Rapoarte Livrări" },
        ]}
      />

      <div className="px-6 space-y-6">

        {/* Year selector */}
        <div className="flex items-center gap-3">
          <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <KpiCard
            label="Total Livrări"
            value={loading ? "—" : fmtNum(kpis?.totalDeliveries ?? 0)}
            sub={kpis?.avgKmPerDelivery ? `${fmtNum(kpis.avgKmPerDelivery, 1)} km/livrare` : undefined}
            icon={<Package className="h-4 w-4" />}
            accent="border-t-[#1e3a5f]"
          />
          <KpiCard
            label="Km Parcurși"
            value={loading ? "—" : `${fmtNum(kpis?.totalKm ?? 0)} km`}
            sub={deliveriesWithCalc.length > 0 ? `${deliveriesWithCalc.length} rute calculate` : undefined}
            icon={<Route className="h-4 w-4" />}
            accent="border-t-[#8e44ad]"
          />
          <KpiCard
            label="Deviere Km"
            value={loading ? "—" : (avgDeviation !== null ? `${avgDeviation >= 0 ? "+" : ""}${Math.round(avgDeviation * 100)}%` : "—")}
            sub="Față de distanța calculată"
            icon={<TrendingUp className="h-4 w-4" />}
            accent="border-t-[#2980b9]"
          />
          <KpiCard
            label="Cost Combustibil"
            value={loading ? "—" : fmtRON(kpis?.totalFuelCost ?? 0)}
            sub={kpis?.avgCostPerKm ? `${fmtNum(kpis.avgCostPerKm, 2)} lei/km` : undefined}
            icon={<Fuel className="h-4 w-4" />}
            accent="border-t-[#e67e22]"
          />
          <KpiCard
            label="Cost Logistic"
            value={loading ? "—" : fmtRON(kpis?.totalLogisticCost ?? 0)}
            icon={<DollarSign className="h-4 w-4" />}
            accent="border-t-[#e74c3c]"
          />
          <KpiCard
            label="Încasări Transport"
            value={loading ? "—" : fmtRON(kpis?.totalRevenue ?? 0)}
            sub={kpis ? `${pct(kpis.totalRevenue, kpis.totalLogisticCost)} acoperit` : undefined}
            icon={<DollarSign className="h-4 w-4" />}
            accent="border-t-[#27ae60]"
          />
          <KpiCard
            label="Livrări Eficiente"
            value={loading ? "—" : `${kpis?.coveredPercent ?? 0}%`}
            sub={kpis?.incompleteCount ? `${kpis.incompleteCount} date incomplete` : "Date complete"}
            icon={<TrendingUp className="h-4 w-4" />}
            accent="border-t-[#16a085]"
          />
        </div>

        {/* Problems alert */}
        {!loading && data && (() => {
          const p = data.problems;
          const issues = [
            p.missingKm.length      > 0 && `${p.missingKm.length} livrări fără km`,
            p.missingInvoice.length > 0 && `${p.missingInvoice.length} fără factură`,
            p.highCostRatio.length  > 0 && `${p.highCostRatio.length} cost logistic >30%`,
          ].filter(Boolean);
          if (!issues.length) return null;
          return (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">Atenție:</span>
                {issues.map((s, i) => (
                  <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{s}</Badge>
                ))}
              </AlertDescription>
            </Alert>
          );
        })()}

        {/* ── 1. HARTĂ INTERACTIVĂ ────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <SectionHeader n="1" title="HARTĂ INTERACTIVĂ LIVRĂRI" color="#1e3a5f" />
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">Colorare după:</span>
              {(["deliveries", "km", "cost"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMapMode(m)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    mapMode === m
                      ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                      : "bg-white text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {m === "deliveries" ? "Nr. Livrări" : m === "km" ? "Km Total" : "Cost Logistic"}
                </button>
              ))}
            </div>
            {loading ? (
              <Skeleton className="h-[460px] w-full" />
            ) : (
              <RomaniaMap countyStats={data?.countyStats ?? []} colorBy={mapMode} />
            )}
            {/* Legend */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Intensitate:</span>
              {["#fff7ec","#fdd49e","#fc8d59","#ef6548","#d7301f","#990000"].map((c, i) => (
                <div key={i} className="w-5 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
              <span className="text-xs text-muted-foreground ml-1">Mic → Mare</span>
            </div>
          </CardContent>
        </Card>

        {/* ── 2. EVOLUȚIE LUNARĂ ──────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <SectionHeader n="2" title="EVOLUȚIE LUNARĂ" color="#27ae60" />
          <CardContent className="p-0">
            <div className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="r" orientation="right"
                    tickFormatter={v => `${fmtNum(v as number)} lei`} tick={{ fontSize: 11 }} />
                  <ReTooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((v: number, n: string) => n === "Cost logistic"
                      ? fmtRON(v) : fmtNum(v)) as any}
                  />
                  <Legend />
                  <Line yAxisId="l" type="monotone" dataKey="deliveryCount" name="Livrări"
                    stroke="#1e3a5f" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="r" type="monotone" dataKey="totalLogistic" name="Cost logistic"
                    stroke="#e74c3c" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="l" type="monotone" dataKey="totalKm" name="Km"
                    stroke="#8e44ad" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto border-t">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#27ae60]/10 border-b">
                    <th className="px-3 py-2 text-left font-semibold">Lună</th>
                    <th className="px-3 py-2 text-right font-semibold">Livrări</th>
                    <th className="px-3 py-2 text-right font-semibold">Km</th>
                    <th className="px-3 py-2 text-right font-semibold">Cost logistic</th>
                    <th className="px-3 py-2 text-right font-semibold">Încasări</th>
                    <th className="px-3 py-2 text-right font-semibold">Eficiență</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="px-3 py-2">
                            <Skeleton className="h-3 w-12" />
                          </td>
                        ))}
                      </tr>
                    ))
                    : (data?.monthlyTrends ?? []).map((m: MonthlyTrend) => (
                      <tr key={`${m.year}-${m.month}`} className="border-b hover:bg-muted/30">
                        <td className="px-3 py-2 font-medium">
                          {MONTHS_RO[(m.month - 1)]} {m.year}
                        </td>
                        <td className="px-3 py-2 text-right">{m.deliveryCount}</td>
                        <td className="px-3 py-2 text-right">{fmtNum(m.totalKm)} km</td>
                        <td className="px-3 py-2 text-right">{fmtRON(m.totalLogistic)}</td>
                        <td className="px-3 py-2 text-right">{fmtRON(m.totalRevenue)}</td>
                        <td className="px-3 py-2 text-right">{m.efficiency}%</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ── 3. LIVRĂRI DETALIATE ────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <SectionHeader n="3" title={`LIVRĂRI DETALIATE (${data?.enrichedDeliveries.length ?? 0})`} color="#8e44ad" />
          <CardContent className="p-0 overflow-x-auto">
            {loading
              ? <Skeleton className="h-48 w-full m-4" />
              : <DeliveriesTable rows={data?.enrichedDeliveries ?? []} />
            }
          </CardContent>
        </Card>

        {/* ── 4. STATISTICI VEHICULE + ȘOFERI ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <SectionHeader n="4" title="STATISTICI VEHICULE" color="#d35400" />
            <CardContent className="p-4 space-y-4">
              {loading ? <Skeleton className="h-40 w-full" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data?.vehicleStats ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="vehicle" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ReTooltip />
                      <Legend />
                      <Bar dataKey="totalKm" name="Km" fill="#8e44ad" radius={[3,3,0,0]} />
                      <Bar dataKey="deliveryCount" name="Livrări" fill="#d35400" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#d35400]/10 border-b">
                        <th className="px-3 py-2 text-left">Vehicul</th>
                        <th className="px-3 py-2 text-right">Livrări</th>
                        <th className="px-3 py-2 text-right">Km</th>
                        <th className="px-3 py-2 text-right">Combustibil</th>
                        <th className="px-3 py-2 text-right">Cost log.</th>
                        <th className="px-3 py-2 text-right">Eficiență</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.vehicleStats ?? []).map((v: VehicleSummary) => (
                        <tr key={v.vehicle} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-mono font-semibold">{v.vehicle || "—"}</td>
                          <td className="px-3 py-2 text-right">{v.deliveryCount}</td>
                          <td className="px-3 py-2 text-right">{fmtNum(v.totalKm)}</td>
                          <td className="px-3 py-2 text-right">{fmtRON(v.totalFuel)}</td>
                          <td className="px-3 py-2 text-right">{fmtRON(v.totalLogistic)}</td>
                          <td className="px-3 py-2 text-right">
                            {v.deliveryCount > 0
                              ? `${Math.round((v.coveredCount / v.deliveryCount) * 100)}%`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <SectionHeader n="5" title="STATISTICI ȘOFERI" color="#16a085" />
            <CardContent className="p-4 space-y-4">
              {loading ? <Skeleton className="h-40 w-full" /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={(data?.driverStats ?? []).slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="driver" type="category" width={100} tick={{ fontSize: 11 }} />
                      <ReTooltip />
                      <Bar dataKey="deliveryCount" name="Livrări" fill="#16a085" radius={[0,3,3,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#16a085]/10 border-b">
                        <th className="px-3 py-2 text-left">Șofer</th>
                        <th className="px-3 py-2 text-right">Livrări</th>
                        <th className="px-3 py-2 text-right">Km total</th>
                        <th className="px-3 py-2 text-right">Km/livr.</th>
                        <th className="px-3 py-2 text-left">Vehicule</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.driverStats ?? []).map((d: DriverStats) => (
                        <tr key={d.driver} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-medium">{d.driver || "Necunoscut"}</td>
                          <td className="px-3 py-2 text-right">{d.deliveryCount}</td>
                          <td className="px-3 py-2 text-right">{fmtNum(d.totalKm)}</td>
                          <td className="px-3 py-2 text-right">
                            {d.deliveryCount > 0 ? fmtNum(d.totalKm / d.deliveryCount, 1) : "—"}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {d.vehiclesUsed.join(", ") || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── 6. TOP JUDEȚE + COMBUSTIBIL ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <SectionHeader n="6" title="TOP JUDEȚE (LIVRĂRI)" color="#2c3e50" />
            <CardContent className="p-4">
              {loading ? <Skeleton className="h-52 w-full" /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={(data?.countyStats ?? []).slice(0, 12)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="county" type="category" width={90} tick={{ fontSize: 11 }} />
                    <ReTooltip />
                    <Bar dataKey="deliveryCount" name="Livrări" fill="#2c3e50" radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <SectionHeader n="7" title="COMBUSTIBIL & CHELTUIELI" color="#c0392b" />
            <CardContent className="p-4 space-y-4">
              {loading ? <Skeleton className="h-52 w-full" /> : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={(data?.expenseSummary ?? []).slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={v => `${fmtNum(v as number)} lei`}
                        tick={{ fontSize: 10 }} />
                      <YAxis dataKey="expenseType" type="category" width={100} tick={{ fontSize: 10 }} />
                      <ReTooltip
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={((v: number) => fmtRON(v)) as any}
                      />
                      <Bar dataKey="amount" name="Sumă" fill="#c0392b" radius={[0,3,3,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <div className="text-xs text-muted-foreground">Total combustibil</div>
                      <div className="font-bold text-sm">{fmtRON(kpis?.totalFuelCost ?? 0)}</div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <div className="text-xs text-muted-foreground">Alte cheltuieli</div>
                      <div className="font-bold text-sm">{fmtRON(kpis?.totalExpenses ?? 0)}</div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <div className="text-xs text-muted-foreground">Total costuri</div>
                      <div className="font-bold text-sm">{fmtRON((kpis?.totalFuelCost ?? 0) + (kpis?.totalExpenses ?? 0))}</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── 8. PROBLEME IDENTIFICATE ────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <SectionHeader n="8" title="PROBLEME IDENTIFICATE" color="#7f8c8d" />
          <CardContent className="p-4 space-y-4">
            {loading && <Skeleton className="h-24 w-full" />}

            {!loading && data && (() => {
              const p = data.problems;
              const hasIssues = p.missingKm.length > 0 || p.highCostRatio.length > 0 || p.missingInvoice.length > 0;
              if (!hasIssues) return (
                <p className="text-sm text-green-700 font-medium">
                  Nu au fost identificate probleme în datele de livrare.
                </p>
              );
              return (
                <div className="space-y-4">
                  {p.missingKm.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> {p.missingKm.length} livrări fără km înregistrați
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr className="bg-orange-50 border-b">
                            <th className="px-2 py-1 text-left">Data</th>
                            <th className="px-2 py-1 text-left">Vehicul</th>
                            <th className="px-2 py-1 text-left">Destinație</th>
                            <th className="px-2 py-1 text-left">Factură</th>
                            <th className="px-2 py-1 text-left">Foaie / Rând</th>
                          </tr></thead>
                          <tbody>
                            {p.missingKm.slice(0, 10).map((d, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-2 py-1">{d.date}</td>
                                <td className="px-2 py-1 font-mono">{d.vehicleNumber}</td>
                                <td className="px-2 py-1">{d.arrivalLocation || "—"}</td>
                                <td className="px-2 py-1 font-mono">{d.invoiceNumber || "—"}</td>
                                <td className="px-2 py-1 text-muted-foreground">{d.sourceSheet} r.{d.rowNumber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {p.highCostRatio.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> {p.highCostRatio.length} livrări cu cost logistic &gt;30% din valoarea facturii
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr className="bg-red-50 border-b">
                            <th className="px-2 py-1 text-left">Data</th>
                            <th className="px-2 py-1 text-left">Rută</th>
                            <th className="px-2 py-1 text-right">Km</th>
                            <th className="px-2 py-1 text-right">Cost log.</th>
                            <th className="px-2 py-1 text-left">Factură</th>
                            <th className="px-2 py-1 text-right">Ratio</th>
                          </tr></thead>
                          <tbody>
                            {p.highCostRatio.map((d, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-2 py-1">{d.date}</td>
                                <td className="px-2 py-1">{d.departureLocation} → {d.arrivalLocation}</td>
                                <td className="px-2 py-1 text-right">{fmtNum(d.totalKm)}</td>
                                <td className="px-2 py-1 text-right font-semibold">{fmtRON(d.logisticCost)}</td>
                                <td className="px-2 py-1 font-mono">{d.invoiceNumber || "—"}</td>
                                <td className="px-2 py-1 text-right text-red-600 font-bold">
                                  {d.profitabilityRatio !== null
                                    ? `${Math.round(d.profitabilityRatio * 100)}%`
                                    : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Suppress unused import warnings
const _icons = { Map, BarChart2, MapPin, Truck, Users };
void _icons;
