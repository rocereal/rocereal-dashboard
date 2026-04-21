"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { Car, Loader2, RefreshCw, Wifi, WifiOff, Gauge, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VehiclesTable } from "./VehiclesTable";

// Dynamic import to avoid SSR issues with Leaflet
const VehicleMap = dynamic(
  () => import("./VehicleMap").then((m) => ({ default: m.VehicleMap })),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg" style={{ minHeight: 400 }}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )}
);

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  make: string;
  model: string;
  fuelType: string;
  lat: number | null;
  lng: number | null;
  speed: number;
  direction: number;
  altitude: number;
  lastSeen: string | null;
  satellites: number;
  online: boolean;
}

export default function RenderPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tracking/vehicles", { cache: "no-store" });
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
      setLastFetched(new Date());
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const totalVehicles = vehicles.length;
  const onlineVehicles = vehicles.filter((v) => v.online).length;
  const movingVehicles = vehicles.filter((v) => v.speed > 0).length;
  const positionedVehicles = vehicles.filter((v) => v.lat !== null).length;

  return (
    <div className="flex flex-col space-y-4">
      <DashboardHeader
        title="Tracking Mașini"
        subtitle="Monitorizare în timp real a pozițiilor vehiculelor din flotă."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Tracking Mașini" },
        ]}
        primaryAction={{
          label: "Refresh",
          icon: <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />,
          onClick: load,
        }}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border !bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total vehicule</CardTitle>
              <div className="bg-primary/20 size-8 flex items-center justify-center rounded-full">
                <Car className="h-3 w-3 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {loading && vehicles.length === 0 ? "—" : totalVehicles}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Vehicule înregistrate în flotă</p>
          </CardContent>
        </Card>

        <Card className="border !bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online</CardTitle>
              <div className="bg-green-100 dark:bg-green-950 size-8 flex items-center justify-center rounded-full">
                <Wifi className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
              {loading && vehicles.length === 0 ? "—" : onlineVehicles}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                <WifiOff className="h-3 w-3 mr-1" />
                {totalVehicles - onlineVehicles} offline
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border !bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">În mișcare</CardTitle>
              <div className="bg-blue-100 dark:bg-blue-950 size-8 flex items-center justify-center rounded-full">
                <Gauge className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
              {loading && vehicles.length === 0 ? "—" : movingVehicles}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Vehicule cu viteză &gt; 0 km/h</p>
          </CardContent>
        </Card>

        <Card className="border !bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Localizate GPS</CardTitle>
              <div className="bg-orange-100 dark:bg-orange-950 size-8 flex items-center justify-center rounded-full">
                <MapPin className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums text-orange-600 dark:text-orange-400">
              {loading && vehicles.length === 0 ? "—" : positionedVehicles}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Vehicule cu semnal GPS activ</p>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card className="border !bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Hartă în timp real</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {lastFetched
                ? `Actualizat la ${lastFetched.toLocaleTimeString("ro-RO")}`
                : loading ? "Se încarcă..." : ""}
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={load} disabled={loading}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pb-0">
          <div style={{ height: "480px" }} className="overflow-hidden rounded-b-lg">
            <VehicleMap vehicles={vehicles} />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border !bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Listă vehicule</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && vehicles.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <VehiclesTable vehicles={vehicles} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
