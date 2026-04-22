"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Database,
  GitBranch,
  HelpCircle,
  Loader2,
  Megaphone,
  Phone,
  Receipt,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ServiceStatus = "operational" | "degraded" | "down" | "unknown";

interface ServiceResult {
  id: string;
  name: string;
  status: ServiceStatus;
  message: string;
  latencyMs?: number;
  meta?: Record<string, string | number | boolean | null>;
}

interface StatusData {
  overallStatus: ServiceStatus;
  checkedAt: string;
  services: ServiceResult[];
}

// ─── icon map ────────────────────────────────────────────────────────────────
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "google-analytics": BarChart3,
  "invox": Phone,
  "smartbill": Receipt,
  "facebook-ads": Megaphone,
  "github-actions": GitBranch,
  "database": Database,
};

const SERVICE_COLORS: Record<string, string> = {
  "google-analytics": "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  "invox": "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  "smartbill": "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  "facebook-ads": "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
  "github-actions": "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  "database": "bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400",
};

// ─── status helpers ───────────────────────────────────────────────────────────
function statusConfig(s: ServiceStatus) {
  switch (s) {
    case "operational":
      return {
        icon: CheckCircle2,
        dot: "bg-green-500",
        badge: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        label: "Operațional",
        pulse: false,
      };
    case "degraded":
      return {
        icon: AlertTriangle,
        dot: "bg-yellow-500",
        badge: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
        label: "Degradat",
        pulse: true,
      };
    case "down":
      return {
        icon: XCircle,
        dot: "bg-red-500",
        badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        label: "Inactiv",
        pulse: true,
      };
    default:
      return {
        icon: HelpCircle,
        dot: "bg-gray-400",
        badge: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
        label: "Necunoscut",
        pulse: false,
      };
  }
}

function overallLabel(s: ServiceStatus) {
  if (s === "operational") return { label: "Toate sistemele funcționează normal", color: "text-green-600 dark:text-green-400" };
  if (s === "degraded") return { label: "Unele sisteme au probleme parțiale", color: "text-yellow-600 dark:text-yellow-400" };
  if (s === "down") return { label: "Unul sau mai multe sisteme sunt inactive", color: "text-red-600 dark:text-red-400" };
  return { label: "Status necunoscut — se verifică...", color: "text-muted-foreground" };
}

// ─── ServiceCard ─────────────────────────────────────────────────────────────
function ServiceCard({ svc }: { svc: ServiceResult }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig(svc.status);
  const Icon = SERVICE_ICONS[svc.id] ?? CircleDot;
  const iconColor = SERVICE_COLORS[svc.id] ?? "bg-muted text-muted-foreground";
  const hasMeta = svc.meta && Object.keys(svc.meta).length > 0;

  return (
    <Card className="border !bg-card shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left: icon + name + message */}
          <div className="flex items-start gap-3 min-w-0">
            <div className={`size-10 flex items-center justify-center rounded-xl shrink-0 ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm">{svc.name}</span>
                {svc.latencyMs !== undefined && (
                  <span className="text-xs text-muted-foreground tabular-nums">{svc.latencyMs}ms</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{svc.message}</p>
            </div>
          </div>

          {/* Right: badge + expand */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={`text-xs flex items-center gap-1 ${cfg.badge}`}>
              <span className={`inline-block size-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
              {cfg.label}
            </Badge>
            {hasMeta && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Meta details */}
      {expanded && hasMeta && (
        <CardContent className="pt-0">
          <div className="rounded-lg border bg-muted/40 p-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
            {Object.entries(svc.meta!).map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground capitalize shrink-0">
                  {k.replace(/([A-Z])/g, " $1").toLowerCase()}
                </span>
                <span className="text-xs font-medium truncate">
                  {v === null || v === undefined ? "—" : String(v)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── OverallBanner ────────────────────────────────────────────────────────────
function OverallBanner({ status, checkedAt }: { status: ServiceStatus; checkedAt: string }) {
  const cfg = statusConfig(status);
  const { label, color } = overallLabel(status);
  const StatusIcon = cfg.icon;

  const fmtTime = new Date(checkedAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const bannerBg = {
    operational: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
    degraded: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
    down: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
    unknown: "bg-muted border-border",
  }[status];

  return (
    <div className={`flex items-center justify-between rounded-xl border p-4 ${bannerBg}`}>
      <div className="flex items-center gap-3">
        <div className={`size-10 flex items-center justify-center rounded-full ${cfg.badge}`}>
          <StatusIcon className="h-5 w-5" />
        </div>
        <div>
          <p className={`font-semibold text-sm ${color}`}>{label}</p>
          <p className="text-xs text-muted-foreground">Ultima verificare: {fmtTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`inline-block size-2.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
        <span className={`text-sm font-medium ${color}`}>{cfg.label}</span>
      </div>
    </div>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ services }: { services: ServiceResult[] }) {
  const counts = {
    operational: services.filter(s => s.status === "operational").length,
    degraded: services.filter(s => s.status === "degraded").length,
    down: services.filter(s => s.status === "down").length,
    unknown: services.filter(s => s.status === "unknown").length,
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        { label: "Operaționale", count: counts.operational, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/40" },
        { label: "Degradate", count: counts.degraded, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/40" },
        { label: "Inactive", count: counts.down, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40" },
        { label: "Necunoscute", count: counts.unknown, color: "text-muted-foreground", bg: "bg-muted/50" },
      ].map(({ label, count, color, bg }) => (
        <div key={label} className={`rounded-xl border p-3 text-center ${bg}`}>
          <div className={`text-2xl font-bold tabular-nums ${color}`}>{count}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function RenderPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const json = await res.json();
      setData(json as StatusData);
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Monitorizare Sisteme"
        subtitle="Status în timp real al integrărilor și serviciilor externe"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Monitorizare Sisteme" },
        ]}
        primaryAction={{
          label: loading ? "Se verifică..." : "Verifică acum",
          icon: loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <RefreshCw className="h-4 w-4" />,
          onClick: loading ? undefined : load,
        }}
      />

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Se verifică toate sistemele...</p>
        </div>
      ) : data ? (
        <>
          <OverallBanner status={data.overallStatus} checkedAt={data.checkedAt} />
          <StatRow services={data.services} />

          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Servicii monitorizate</span>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {data.services.map(svc => (
                <ServiceCard key={svc.id} svc={svc} />
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pb-2">
            Se actualizează automat la fiecare 60 de secunde · Ultima verificare: {new Date(data.checkedAt).toLocaleString("ro-RO")}
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Nu s-au putut încărca datele de status.
        </div>
      )}
    </div>
  );
}
