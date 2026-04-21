"use client";

import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { PieChart } from "@/components/charts/PieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ChartConfig } from "@/components/ui/charts";
import {
  AlertTriangle, Eye, Globe, Loader2, MousePointerClick,
  RefreshCw, Timer, TrendingDown, TrendingUp, Users, Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Overview {
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  newUsers: number;
  engagementRate: number;
}

interface TimePoint { [key: string]: string | number | undefined; date: string; sessions: number; users: number }
interface TopPage { path: string; title: string; views: number; avgDuration: number }
interface Slice { [key: string]: string | number | undefined; name: string; value: number }

interface GAData {
  overview: Overview;
  sessionsOverTime: TimePoint[];
  topPages: TopPage[];
  sources: Slice[];
  devices: Slice[];
}

const sessionsConfig: ChartConfig = {
  sessions: { label: "Sesiuni",  color: "var(--chart-1)" },
  users:    { label: "Utilizatori", color: "var(--chart-2)" },
};

const MOCK: GAData = {
  overview: {
    sessions: 4821, users: 3647, pageViews: 12380, bounceRate: 42.3,
    avgSessionDuration: 187, conversions: 214, newUsers: 2903, engagementRate: 57.7,
  },
  sessionsOverTime: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, sessions: 100 + Math.floor(Math.random() * 300), users: 80 + Math.floor(Math.random() * 220) };
  }),
  topPages: [
    { path: "/", title: "Acasă", views: 3210, avgDuration: 142 },
    { path: "/produse/tricicluri", title: "Tricicluri", views: 1870, avgDuration: 210 },
    { path: "/produse/tractoare", title: "Tractoare", views: 1540, avgDuration: 198 },
    { path: "/contact", title: "Contact", views: 980, avgDuration: 95 },
    { path: "/produse/utilitare", title: "Utilitare", views: 870, avgDuration: 185 },
  ],
  sources: [
    { name: "Organic Search", value: 1820 },
    { name: "Direct", value: 1240 },
    { name: "Paid Search", value: 890 },
    { name: "Social", value: 520 },
    { name: "Referral", value: 351 },
  ],
  devices: [
    { name: "mobile", value: 2650 },
    { name: "desktop", value: 1820 },
    { name: "tablet", value: 351 },
  ],
};

const fmtDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
};

const fmtNum = (n: number) =>
  new Intl.NumberFormat("ro-RO").format(n);

function MetricCard({
  title, value, sub, icon: Icon, trend, positive, color,
}: {
  title: string; value: string; sub: string;
  icon: React.ElementType; trend?: string; positive?: boolean;
  color?: string;
}) {
  return (
    <Card className="border !bg-card shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`size-8 flex items-center justify-center rounded-full ${color ?? "bg-primary/20"}`}>
            <Icon className={`h-3 w-3 ${color ? "" : "text-primary"}`} />
          </div>
        </div>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
      </CardHeader>
      <CardContent className="pt-0">
        {trend && (
          <Badge
            variant="outline"
            className={`text-xs flex items-center gap-1 mb-1 w-fit ${
              positive
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </Badge>
        )}
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function RenderPage() {
  const [data, setData] = useState<GAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/google", { cache: "no-store" });
      const json = await res.json();
      if (json.error) {
        setData(MOCK);
        setUseMock(true);
      } else {
        setData(json as GAData);
        setUseMock(false);
      }
      setLastFetched(new Date());
    } catch {
      setData(MOCK);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const d = data ?? MOCK;

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Google Analytics"
        subtitle="Monitorizare trafic și comportament utilizatori — rocereal.ro"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Colectare Date" },
          { label: "Surse de date" },
          { label: "Google Analytics" },
        ]}
        primaryAction={{
          label: loading ? "Se încarcă..." : "Refresh",
          icon: <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />,
          onClick: load,
        }}
      />

      {/* Auth notice */}
      {useMock && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300">Date demonstrative — autentificare Google Analytics necesară</p>
            <p className="text-amber-700 dark:text-amber-400 mt-1">
              Cheia furnizată este un <strong>Measurement Protocol Secret</strong> (pentru trimiterea datelor, nu citirea lor).
              Pentru a afișa date reale, adaugă în Vercel:
              <code className="mx-1 px-1 bg-amber-100 dark:bg-amber-900 rounded text-xs">GA4_PROPERTY_ID</code> și
              <code className="mx-1 px-1 bg-amber-100 dark:bg-amber-900 rounded text-xs">GA4_SERVICE_ACCOUNT_JSON</code>.
            </p>
          </div>
        </div>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              title="Sesiuni" value={fmtNum(d.overview.sessions)}
              sub="Ultimele 30 zile" icon={Globe}
              color="bg-blue-100 dark:bg-blue-950" trend="+12.4%" positive
            />
            <MetricCard
              title="Utilizatori" value={fmtNum(d.overview.users)}
              sub="Utilizatori unici" icon={Users}
              color="bg-green-100 dark:bg-green-950" trend="+8.1%" positive
            />
            <MetricCard
              title="Vizualizări pagini" value={fmtNum(d.overview.pageViews)}
              sub="Total pageviews" icon={Eye}
              color="bg-purple-100 dark:bg-purple-950" trend="+15.2%" positive
            />
            <MetricCard
              title="Utilizatori noi" value={fmtNum(d.overview.newUsers)}
              sub={`${Math.round((d.overview.newUsers / d.overview.users) * 100)}% din total`} icon={Zap}
              color="bg-orange-100 dark:bg-orange-950" trend="+5.7%" positive
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              title="Rată de respingere" value={`${d.overview.bounceRate}%`}
              sub="Bounce rate" icon={MousePointerClick}
              color="bg-red-100 dark:bg-red-950" trend="-3.2%" positive
            />
            <MetricCard
              title="Durată medie sesiune" value={fmtDuration(d.overview.avgSessionDuration)}
              sub="Per vizită" icon={Timer}
              color="bg-cyan-100 dark:bg-cyan-950" trend="+0m 12s" positive
            />
            <MetricCard
              title="Rată de engagement" value={`${d.overview.engagementRate}%`}
              sub="Sesiuni angajate" icon={TrendingUp}
              color="bg-teal-100 dark:bg-teal-950" trend="+4.1%" positive
            />
            <MetricCard
              title="Conversii" value={fmtNum(d.overview.conversions)}
              sub="Evenimente de conversie" icon={Zap}
              color="bg-yellow-100 dark:bg-yellow-950" trend="+18.3%" positive
            />
          </div>

          {/* Sessions over time */}
          <SampleLineChart
            data={d.sessionsOverTime}
            title="Sesiuni & Utilizatori — Ultimele 30 zile"
            description="Evoluția traficului zilnic pe rocereal.ro"
            config={sessionsConfig}
            dataKeys={["sessions", "users"]}
            dateKey="date"
            showTimeRange={false}
            showCoinSelector={false}
          />

          {/* Sources + Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart
              data={d.sources}
              title="Surse de trafic"
              description="Distribuția sesiunilor după canalul de proveniență"
              dataKey="value"
              nameKey="name"
            />
            <PieChart
              data={d.devices}
              title="Dispozitive"
              description="Sesiuni după tipul de dispozitiv"
              dataKey="value"
              nameKey="name"
            />
          </div>

          {/* Top Pages */}
          <Card className="border !bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Top pagini vizitate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Titlu pagină</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">Vizualizări</TableHead>
                      <TableHead className="text-right">Durată medie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.topPages.map((p, i) => (
                      <TableRow key={p.path}>
                        <TableCell className="text-muted-foreground text-sm w-8">{i + 1}</TableCell>
                        <TableCell className="font-medium max-w-[180px] truncate">{p.title}</TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-muted-foreground">{p.path}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium">{fmtNum(p.views)}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {fmtDuration(p.avgDuration)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {useMock ? "Date demonstrative" : `Proprietate: ${process.env.NEXT_PUBLIC_GA4_PROPERTY_ID ?? "rocereal.ro"}`}
            </span>
            <span>
              {lastFetched ? `Actualizat la ${lastFetched.toLocaleTimeString("ro-RO")}` : ""}
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={load} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
