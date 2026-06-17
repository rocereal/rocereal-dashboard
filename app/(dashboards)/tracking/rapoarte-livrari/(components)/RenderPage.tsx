"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Truck, Fuel, MapPin, TrendingUp, AlertTriangle, Package,
  Route, DollarSign, Users, BarChart2,
} from "lucide-react";
import type {
  DeliveryReport,
  EnrichedDelivery,
  VehicleSummary,
  DriverStats,
  CountyStats,
} from "@/lib/deliveryCostCalculator";
import { COUNTY_CENTERS } from "@/lib/countyMapper";

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number, d = 0) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  efficient:  "bg-green-100 text-green-700 border-green-200",
  covered:    "bg-blue-100 text-blue-700 border-blue-200",
  high_cost:  "bg-orange-100 text-orange-700 border-orange-200",
  subsidized: "bg-red-100 text-red-700 border-red-200",
  incomplete: "bg-gray-100 text-gray-500 border-gray-200",
};

function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <Badge variant="outline" className={`text-xs ${STATUS_COLORS[status] ?? ""}`}>
      {label}
    </Badge>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, sub, icon: Icon, iconClass, loading,
}: {
  title: string; value: string; sub?: string;
  icon: React.ElementType; iconClass: string; loading: boolean;
}) {
  return (
    <Card className="border !bg-card shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`size-8 flex items-center justify-center rounded-full ${iconClass}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-28 mt-1" />
        ) : (
          <div className="text-2xl font-bold tabular-nums">{value}</div>
        )}
      </CardHeader>
      {sub && (
        <CardContent className="pt-0">
          {loading ? <Skeleton className="h-4 w-20" /> : (
            <p className="text-xs text-muted-foreground">{sub}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Map component ────────────────────────────────────────────────────────────

function CountyDeliveryMap({ countyStats }: { countyStats: CountyStats[] }) {
  const mapRef    = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInst   = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("leaflet/dist/leaflet.css");
      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      map.setView([45.9432, 24.9668], 6);
      mapInst.current = map;

      const maxCount = Math.max(...countyStats.map(c => c.deliveryCount), 1);

      for (const cs of countyStats) {
        const coords = COUNTY_CENTERS[cs.county];
        if (!coords) continue;
        const radius = 8 + (cs.deliveryCount / maxCount) * 22;
        const circle = L.circleMarker(coords, {
          radius,
          fillColor: "#ef4444",
          color:     "#b91c1c",
          weight:    1,
          opacity:   0.9,
          fillOpacity: 0.6,
        }).addTo(map);
        circle.bindPopup(
          `<b>${cs.county}</b><br/>${cs.deliveryCount} livrări<br/>${fmtNum(cs.totalKm)} km<br/>${fmtRON(cs.totalLogistic)} cost logistic`,
        );
      }
    });

    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} style={{ height: 420 }} className="rounded-lg border overflow-hidden z-0" />;
}

// ─── Deliveries table ─────────────────────────────────────────────────────────

function DeliveriesTable({ rows }: { rows: EnrichedDelivery[] }) {
  const [page, setPage] = useState(0);
  const PER_PAGE = 50;
  const total  = rows.length;
  const sliced = rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Vehicul</TableHead>
            <TableHead>Șofer</TableHead>
            <TableHead>Destinație</TableHead>
            <TableHead>Județ</TableHead>
            <TableHead className="text-right">Km</TableHead>
            <TableHead className="text-right">Cost log.</TableHead>
            <TableHead className="text-right">Achitat</TableHead>
            <TableHead>Factură</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliced.map((d, i) => (
            <TableRow key={`${d.sourceSheet}-${d.rowNumber}-${i}`}>
              <TableCell className="whitespace-nowrap text-xs">{d.date}</TableCell>
              <TableCell className="text-xs font-mono">{d.vehicleNumber}</TableCell>
              <TableCell className="text-xs">{d.driver || "—"}</TableCell>
              <TableCell className="text-xs max-w-[140px] truncate" title={d.arrivalLocation}>
                {d.arrivalLocation || "—"}
              </TableCell>
              <TableCell className="text-xs">{d.county}</TableCell>
              <TableCell className="text-right text-xs">{fmtNum(d.totalKm)}</TableCell>
              <TableCell className="text-right text-xs">{fmtRON(d.logisticCost)}</TableCell>
              <TableCell className="text-right text-xs">
                {d.amountPaidByClient > 0 ? fmtRON(d.amountPaidByClient) : "—"}
              </TableCell>
              <TableCell className="text-xs font-mono">{d.invoiceNumber || "—"}</TableCell>
              <TableCell>
                <StatusBadge status={d.efficiencyStatus} label={d.efficiencyLabel} />
              </TableCell>
            </TableRow>
          ))}
          {sliced.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground text-sm py-8">
                Nu există livrări în această perioadă.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {total > PER_PAGE && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} din {total}</span>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 rounded border text-xs disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >Anterior</button>
            <button
              className="px-2 py-1 rounded border text-xs disabled:opacity-40"
              disabled={(page + 1) * PER_PAGE >= total}
              onClick={() => setPage(p => p + 1)}
            >Următor</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PIE chart colors ─────────────────────────────────────────────────────────

const PIE_COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#f97316"];

// ─── Main render ──────────────────────────────────────────────────────────────

export default function RenderPage() {
  const [data, setData]       = useState<DeliveryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tracking/deliveries", { cache: "no-store" });
      const json = await res.json() as DeliveryReport & { error?: string };
      if (json.error) { setError(json.error); setData(null); }
      else setData(json);
    } catch {
      setError("Nu s-au putut încărca datele de livrări.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const kpis = data?.kpis;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Rapoarte Livrări</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Date din Google Sheets + facturi SmartBill
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard
          title="Total Livrări" icon={Package}
          iconClass="bg-blue-100 text-blue-700"
          value={loading ? "..." : fmtNum(kpis?.totalDeliveries ?? 0)}
          sub={`${fmtNum(kpis?.avgKmPerDelivery ?? 0, 1)} km/livrare medie`}
          loading={loading}
        />
        <KpiCard
          title="Km Parcurși" icon={Route}
          iconClass="bg-purple-100 text-purple-700"
          value={loading ? "..." : `${fmtNum(kpis?.totalKm ?? 0)} km`}
          loading={loading}
        />
        <KpiCard
          title="Cost Combustibil" icon={Fuel}
          iconClass="bg-orange-100 text-orange-700"
          value={loading ? "..." : fmtRON(kpis?.totalFuelCost ?? 0)}
          sub={`${fmtNum(kpis?.avgCostPerKm ?? 0, 2)} lei/km medie`}
          loading={loading}
        />
        <KpiCard
          title="Cost Logistic Total" icon={DollarSign}
          iconClass="bg-red-100 text-red-700"
          value={loading ? "..." : fmtRON(kpis?.totalLogisticCost ?? 0)}
          loading={loading}
        />
        <KpiCard
          title="Livrări Eficiente" icon={TrendingUp}
          iconClass="bg-green-100 text-green-700"
          value={loading ? "..." : `${kpis?.coveredPercent ?? 0}%`}
          sub={`${kpis?.incompleteCount ?? 0} date incomplete`}
          loading={loading}
        />
      </div>

      {/* Problems banner */}
      {!loading && data && (
        (() => {
          const p = data.problems;
          const issues = [
            p.missingKm.length > 0 && `${p.missingKm.length} livrări fără km`,
            p.missingInvoice.length > 0 && `${p.missingInvoice.length} fără factură`,
            p.highCostRatio.length > 0 && `${p.highCostRatio.length} cu cost logistic >30% din factură`,
          ].filter(Boolean);
          if (!issues.length) return null;
          return (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex flex-wrap gap-2">
                <span className="font-medium">Atenție:</span>
                {issues.map((s, i) => <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{s}</Badge>)}
              </AlertDescription>
            </Alert>
          );
        })()
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview"><BarChart2 className="h-3.5 w-3.5 mr-1.5" />Sumar</TabsTrigger>
          <TabsTrigger value="livrari"><Package className="h-3.5 w-3.5 mr-1.5" />Livrări</TabsTrigger>
          <TabsTrigger value="alimentari"><Fuel className="h-3.5 w-3.5 mr-1.5" />Alimentări</TabsTrigger>
          <TabsTrigger value="masini"><Truck className="h-3.5 w-3.5 mr-1.5" />Mașini</TabsTrigger>
          <TabsTrigger value="soferi"><Users className="h-3.5 w-3.5 mr-1.5" />Șoferi</TabsTrigger>
          <TabsTrigger value="judete"><MapPin className="h-3.5 w-3.5 mr-1.5" />Județe</TabsTrigger>
          <TabsTrigger value="harta"><MapPin className="h-3.5 w-3.5 mr-1.5" />Hartă</TabsTrigger>
          <TabsTrigger value="probleme"><AlertTriangle className="h-3.5 w-3.5 mr-1.5" />Probleme</TabsTrigger>
        </TabsList>

        {/* ── SUMAR ──────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* Monthly trend chart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Evoluție lunară livrări + cost</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-48 w-full" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data?.monthlyTrends ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="l" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="r" orientation="right" tickFormatter={v => `${fmtNum(v)} lei`} tick={{ fontSize: 11 }} />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <ReTooltip formatter={((v: number | undefined, n: string) =>
                        n === "totalLogistic" ? fmtRON(v ?? 0) : fmtNum(v ?? 0)) as any} />
                      <Legend />
                      <Line yAxisId="l" type="monotone" dataKey="deliveryCount" name="Livrări" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line yAxisId="r" type="monotone" dataKey="totalLogistic"  name="Cost log." stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Efficiency pie */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribuție status livrări</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-48 w-full" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          (data?.enrichedDeliveries ?? []).reduce<Record<string, number>>((acc, d) => {
                            acc[d.efficiencyLabel] = (acc[d.efficiencyLabel] ?? 0) + 1;
                            return acc;
                          }, {})
                        ).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                        labelLine={false}
                      >
                        {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Km per vehicle */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Km pe vehicul</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-48 w-full" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data?.vehicleStats ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="vehicle" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <ReTooltip formatter={((v: number | undefined) => `${fmtNum(v ?? 0)} km`) as any} />
                      <Bar dataKey="totalKm" name="Km parcurși" fill="#8b5cf6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Expenses breakdown */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Cheltuieli pe tip</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-48 w-full" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data?.expenseSummary ?? []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={v => `${fmtNum(v)} lei`} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="expenseType" type="category" width={120} tick={{ fontSize: 11 }} />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <ReTooltip formatter={((v: number | undefined) => fmtRON(v ?? 0)) as any} />
                      <Bar dataKey="amount" name="Sumă" fill="#f59e0b" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── LIVRĂRI ────────────────────────────────────────────────────── */}
        <TabsContent value="livrari" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Toate livrările{data ? ` (${data.enrichedDeliveries.length})` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <DeliveriesTable rows={data?.enrichedDeliveries ?? []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ALIMENTĂRI ─────────────────────────────────────────────────── */}
        <TabsContent value="alimentari" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Alimentări combustibil{data ? ` (${data.fuelEntries.length})` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Vehicul</TableHead>
                      <TableHead className="text-right">Km bord</TableHead>
                      <TableHead className="text-right">Sumă (lei)</TableHead>
                      <TableHead>Plată</TableHead>
                      <TableHead>Bon</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Observații</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.fuelEntries ?? []).map((f, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs whitespace-nowrap">{f.date}</TableCell>
                        <TableCell className="text-xs font-mono">{f.vehicleNumber}</TableCell>
                        <TableCell className="text-right text-xs">{f.odometerKm > 0 ? fmtNum(f.odometerKm) : "—"}</TableCell>
                        <TableCell className="text-right text-xs font-semibold">{fmtRON(f.amount)}</TableCell>
                        <TableCell className="text-xs">{f.paymentMethod || "—"}</TableCell>
                        <TableCell className="text-xs">{f.receiptNumber || "—"}</TableCell>
                        <TableCell className="text-xs">{f.expenseType}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{f.observations || "—"}</TableCell>
                      </TableRow>
                    ))}
                    {(data?.fuelEntries ?? []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground text-sm py-8">
                          Nu există înregistrări de alimentare.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── MAȘINI ─────────────────────────────────────────────────────── */}
        <TabsContent value="masini" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Statistici pe vehicul</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicul</TableHead>
                      <TableHead className="text-right">Livrări</TableHead>
                      <TableHead className="text-right">Km total</TableHead>
                      <TableHead className="text-right">Combustibil</TableHead>
                      <TableHead className="text-right">Cost logistic</TableHead>
                      <TableHead className="text-right">Livrări acoperite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.vehicleStats ?? []).map((v: VehicleSummary) => (
                      <TableRow key={v.vehicle}>
                        <TableCell className="font-mono text-sm">{v.vehicle}</TableCell>
                        <TableCell className="text-right">{v.deliveryCount}</TableCell>
                        <TableCell className="text-right">{fmtNum(v.totalKm)} km</TableCell>
                        <TableCell className="text-right">{fmtRON(v.totalFuel)}</TableCell>
                        <TableCell className="text-right">{fmtRON(v.totalLogistic)}</TableCell>
                        <TableCell className="text-right">
                          {v.deliveryCount > 0
                            ? `${Math.round((v.coveredCount / v.deliveryCount) * 100)}%`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ȘOFERI ─────────────────────────────────────────────────────── */}
        <TabsContent value="soferi" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Performanță șoferi</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Șofer</TableHead>
                      <TableHead className="text-right">Livrări</TableHead>
                      <TableHead className="text-right">Km total</TableHead>
                      <TableHead className="text-right">Cost logistic</TableHead>
                      <TableHead className="text-right">Km/livrare</TableHead>
                      <TableHead>Vehicule</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.driverStats ?? []).map((d: DriverStats) => (
                      <TableRow key={d.driver}>
                        <TableCell className="font-medium text-sm">{d.driver}</TableCell>
                        <TableCell className="text-right">{d.deliveryCount}</TableCell>
                        <TableCell className="text-right">{fmtNum(d.totalKm)} km</TableCell>
                        <TableCell className="text-right">{fmtRON(d.totalLogistic)}</TableCell>
                        <TableCell className="text-right">
                          {d.deliveryCount > 0 ? fmtNum(d.totalKm / d.deliveryCount, 1) : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {d.vehiclesUsed.join(", ") || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(data?.driverStats ?? []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground text-sm py-8">
                          Nu există date despre șoferi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── JUDEȚE ─────────────────────────────────────────────────────── */}
        <TabsContent value="judete" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Livrări pe județ (top 15)</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-64 w-full" /> : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={(data?.countyStats ?? []).slice(0, 15)}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="county" type="category" width={100} tick={{ fontSize: 11 }} />
                      <ReTooltip />
                      <Bar dataKey="deliveryCount" name="Livrări" fill="#3b82f6" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Cost logistic pe județ (top 15)</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                {loading ? <Skeleton className="h-64 w-full" /> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Județ</TableHead>
                        <TableHead className="text-right">Livrări</TableHead>
                        <TableHead className="text-right">Km total</TableHead>
                        <TableHead className="text-right">Cost log.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data?.countyStats ?? []).slice(0, 15).map((c: CountyStats) => (
                        <TableRow key={c.county}>
                          <TableCell className="text-sm">{c.county}</TableCell>
                          <TableCell className="text-right text-sm">{c.deliveryCount}</TableCell>
                          <TableCell className="text-right text-sm">{fmtNum(c.totalKm)}</TableCell>
                          <TableCell className="text-right text-sm">{fmtRON(c.totalLogistic)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── HARTĂ ──────────────────────────────────────────────────────── */}
        <TabsContent value="harta" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Distribuție geografică livrări</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[420px] w-full" /> : (
                <CountyDeliveryMap countyStats={data?.countyStats ?? []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PROBLEME ───────────────────────────────────────────────────── */}
        <TabsContent value="probleme" className="mt-4 space-y-4">

          {!loading && data && data.problems.missingKm.length === 0 &&
            data.problems.missingInvoice.length === 0 &&
            data.problems.highCostRatio.length === 0 && (
            <Alert>
              <AlertDescription className="text-green-700">
                Nu au fost identificate probleme în datele de livrare.
              </AlertDescription>
            </Alert>
          )}

          {data && data.problems.missingKm.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-orange-700">
                  Livrări fără km ({data.problems.missingKm.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Vehicul</TableHead>
                      <TableHead>Destinație</TableHead>
                      <TableHead>Factură</TableHead>
                      <TableHead>Foaie</TableHead>
                      <TableHead>Rând</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.problems.missingKm.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">{d.date}</TableCell>
                        <TableCell className="text-xs font-mono">{d.vehicleNumber}</TableCell>
                        <TableCell className="text-xs">{d.arrivalLocation || "—"}</TableCell>
                        <TableCell className="text-xs font-mono">{d.invoiceNumber || "—"}</TableCell>
                        <TableCell className="text-xs">{d.sourceSheet}</TableCell>
                        <TableCell className="text-xs">{d.rowNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {data && data.problems.highCostRatio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-red-700">
                  Cost logistic &gt;30% din factură ({data.problems.highCostRatio.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Vehicul</TableHead>
                      <TableHead>Destinație</TableHead>
                      <TableHead className="text-right">Km</TableHead>
                      <TableHead className="text-right">Cost log.</TableHead>
                      <TableHead>Factură</TableHead>
                      <TableHead className="text-right">Ratio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.problems.highCostRatio.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">{d.date}</TableCell>
                        <TableCell className="text-xs font-mono">{d.vehicleNumber}</TableCell>
                        <TableCell className="text-xs">{d.arrivalLocation || "—"}</TableCell>
                        <TableCell className="text-right text-xs">{fmtNum(d.totalKm)}</TableCell>
                        <TableCell className="text-right text-xs">{fmtRON(d.logisticCost)}</TableCell>
                        <TableCell className="text-xs font-mono">{d.invoiceNumber || "—"}</TableCell>
                        <TableCell className="text-right text-xs text-red-600 font-semibold">
                          {d.profitabilityRatio !== null
                            ? `${Math.round(d.profitabilityRatio * 100)}%`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {loading && <Skeleton className="h-64 w-full" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
