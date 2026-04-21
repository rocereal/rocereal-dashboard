"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Navigation, Wifi, WifiOff } from "lucide-react";

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

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onVehicleClick?: (vehicle: Vehicle) => void;
}

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ro-RO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const directionLabel = (deg: number) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SV", "V", "NV"];
  return dirs[Math.round(deg / 45) % 8];
};

export function VehiclesTable({ vehicles, onVehicleClick }: VehiclesTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicul</TableHead>
            <TableHead>Număr înmatriculare</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Viteză</TableHead>
            <TableHead>Direcție</TableHead>
            <TableHead>Altitudine</TableHead>
            <TableHead>Sateliți</TableHead>
            <TableHead>Ultimul semnal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground text-sm">
                Niciun vehicul găsit.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((v) => (
              <TableRow
                key={v.id}
                className={onVehicleClick ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={() => onVehicleClick?.(v)}
              >
                <TableCell>
                  <div>
                    <span className="font-medium">{v.name}</span>
                    {(v.make || v.model) && (
                      <div className="text-xs text-muted-foreground">
                        {[v.make, v.model].filter(Boolean).join(" ")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm font-medium">{v.plate}</span>
                </TableCell>
                <TableCell>
                  {v.online ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 gap-1">
                      <Wifi className="h-3 w-3" /> Online
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 gap-1">
                      <WifiOff className="h-3 w-3" /> Offline
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className={v.speed > 0 ? "font-medium text-blue-600" : "text-muted-foreground"}>
                    {v.speed} km/h
                  </span>
                </TableCell>
                <TableCell>
                  {v.lat !== null ? (
                    <span className="flex items-center gap-1 text-sm">
                      <Navigation
                        className="h-3 w-3 text-muted-foreground flex-shrink-0"
                        style={{ transform: `rotate(${v.direction}deg)` }}
                      />
                      {directionLabel(v.direction)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{v.altitude > 0 ? `${v.altitude} m` : "—"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{v.satellites > 0 ? v.satellites : "—"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{formatDateTime(v.lastSeen)}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
