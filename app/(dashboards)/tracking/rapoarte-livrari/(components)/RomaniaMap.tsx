"use client";

// @ts-ignore – CSS side-effect import processed by webpack
import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { CountyStats } from "@/lib/deliveryCostCalculator";
import type { EnrichedDelivery } from "@/lib/deliveryCostCalculator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

// ─── Constants ────────────────────────────────────────────────────────────────
const VESTEM: [number, number] = [45.7205, 24.2824];

// Route color by delivery count on that route
function routeColor(count: number): string {
  if (count >= 8)  return "#c0392b"; // red – heavy route
  if (count >= 4)  return "#e67e22"; // orange – medium
  if (count >= 2)  return "#2980b9"; // blue – occasional
  return "#7f8c8d";                   // grey – single
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────

// Quadratic bezier arc between two coordinates (Romania map scale)
function arcPoints(from: [number, number], to: [number, number]): [number, number][] {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  // Perpendicular offset for the control point
  const k = 0.25;
  const ctrlLat = midLat - dLng * k;
  const ctrlLng = midLng + dLat * k;
  const pts: [number, number][] = [];
  for (let t = 0; t <= 1.001; t += 0.04) {
    const s = 1 - t;
    pts.push([
      s * s * from[0] + 2 * s * t * ctrlLat + t * t * to[0],
      s * s * from[1] + 2 * s * t * ctrlLng + t * t * to[1],
    ]);
  }
  return pts;
}

// Compass bearing in degrees (0=N, 90=E …)
function bearing(from: [number, number], to: [number, number]): number {
  const dLng = (to[1] - from[1]) * (Math.PI / 180);
  const lat1 = from[0] * (Math.PI / 180);
  const lat2 = to[0]  * (Math.PI / 180);
  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
}

// ─── Route layer (imperative Leaflet) ────────────────────────────────────────

interface RouteGroup {
  from: [number, number];
  to:   [number, number];
  fromName: string;
  toName:   string;
  count:    number;
  totalKm:  number;
}

function buildRoutes(deliveries: EnrichedDelivery[]): RouteGroup[] {
  const map = new Map<string, RouteGroup>();
  for (const d of deliveries) {
    // Main leg
    if (d.fromCoords && d.toCoords) addLeg(map, d.fromCoords, d.toCoords, d.departureLocation, d.arrivalLocation, d.totalKm / 2 || 0);
    // Return leg (Plecare 2 → Sosire 2) – only if different from main
    if (d.returnDepartureLocation && d.returnArrivalLocation &&
        d.returnDepartureLocation !== d.departureLocation) {
      // Try to resolve return coords from toCoords as departure
      if (d.toCoords) {
        addLeg(map, d.toCoords, d.fromCoords ?? VESTEM, d.returnDepartureLocation, d.returnArrivalLocation, d.totalKm / 2 || 0);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

function addLeg(
  map: Map<string, RouteGroup>,
  from: [number, number], to: [number, number],
  fromName: string, toName: string, km: number,
) {
  // Skip zero-distance (same location)
  if (Math.abs(from[0] - to[0]) < 0.05 && Math.abs(from[1] - to[1]) < 0.05) return;
  const key = `${from[0].toFixed(2)},${from[1].toFixed(2)}-${to[0].toFixed(2)},${to[1].toFixed(2)}`;
  const ex = map.get(key);
  if (ex) { ex.count++; ex.totalKm += km; }
  else map.set(key, { from, to, fromName, toName, count: 1, totalKm: km });
}

function RouteLinesLayer({ deliveries }: { deliveries: EnrichedDelivery[] }) {
  const map = useMap();
  const grpRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    grpRef.current?.clearLayers();
    if (!grpRef.current) { grpRef.current = L.layerGroup().addTo(map); }

    const routes = buildRoutes(deliveries);
    const bounds: [number, number][] = [VESTEM];

    // ── Draw routes ────────────────────────────────────────────────────────
    for (const r of routes) {
      bounds.push(r.to);
      const color  = routeColor(r.count);
      const weight = Math.min(1.5 + r.count * 0.55, 7);
      const pts    = arcPoints(r.from, r.to);

      L.polyline(pts, { color, weight, opacity: 0.72 })
        .addTo(grpRef.current!)
        .bindTooltip(
          `<div style="font-size:12px;line-height:1.6">
            <b>${r.fromName}</b> → <b>${r.toName}</b><br/>
            ${r.count} livrări · ~${Math.round(r.totalKm / r.count)} km/livr.
           </div>`,
          { sticky: true },
        );

      // Arrowhead at destination (rotated triangle via CSS border trick)
      const ang = bearing(r.from, r.to);
      L.marker(r.to, {
        interactive: false,
        icon: L.divIcon({
          html: `<div style="
            width:0;height:0;
            border-left:5px solid transparent;
            border-right:5px solid transparent;
            border-bottom:11px solid ${color};
            transform:rotate(${ang}deg);
            transform-origin:center bottom;
            margin:-6px -5px;
            opacity:.85;
          "></div>`,
          className: "",
          iconSize:  [0, 0],
          iconAnchor:[0, 0],
        }),
      }).addTo(grpRef.current!);
    }

    // ── Destination markers (circle, sized by delivery count) ─────────────
    const destMap = new Map<string, { coords: [number, number]; name: string; count: number }>();
    for (const r of routes) {
      const key = `${r.to[0].toFixed(2)},${r.to[1].toFixed(2)}`;
      const ex = destMap.get(key);
      if (ex) { ex.count += r.count; }
      else destMap.set(key, { coords: r.to, name: r.toName, count: r.count });
    }
    const maxDest = Math.max(...Array.from(destMap.values()).map(d => d.count), 1);
    for (const dest of destMap.values()) {
      const radius = 5 + (dest.count / maxDest) * 14;
      L.circleMarker(dest.coords, {
        radius,
        fillColor:   routeColor(dest.count),
        fillOpacity: 0.88,
        color:       "#fff",
        weight:      1.5,
      }).addTo(grpRef.current!)
        .bindTooltip(`<b>${dest.name}</b><br/>${dest.count} livrări`, { sticky: true });
    }

    // ── HQ marker at Vestem ────────────────────────────────────────────────
    L.circleMarker(VESTEM, {
      radius:      12,
      fillColor:   "#1e3a5f",
      fillOpacity: 1,
      color:       "#fff",
      weight:      2.5,
    }).addTo(grpRef.current!)
      .bindTooltip(
        `<div style="font-size:12px"><b>🏭 Vestem — Sediu Central</b><br/>Punct principal de plecare</div>`,
        { sticky: true },
      );

    L.marker(VESTEM, {
      icon: L.divIcon({
        html: `<div style="font-size:9px;font-weight:800;color:#1e3a5f;background:#fff;border:1.5px solid #1e3a5f;
          padding:1px 3px;border-radius:3px;white-space:nowrap;margin-top:14px;margin-left:-8px">HQ</div>`,
        className: "",
        iconSize:  [0, 0],
        iconAnchor:[0, 0],
      }),
      interactive: false,
    }).addTo(grpRef.current!);

    // ── Fit bounds ─────────────────────────────────────────────────────────
    if (bounds.length > 1) {
      try {
        map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30], animate: false });
      } catch { /* ignore */ }
    }

    return () => { grpRef.current?.clearLayers(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveries]);

  return null;
}

// ─── County background (subtle, choropleth optional) ─────────────────────────

function normalizeCounty(name: string): string {
  return (name ?? "").toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t")
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .trim();
}

const COUNTY_COLOR_STOPS = ["#efefef","#ffe8cc","#ffd09e","#ffb266","#ff8c33","#e06010","#b84000","#8c2200"];

function getCountyColor(value: number, max: number): string {
  if (value === 0 || max === 0) return COUNTY_COLOR_STOPS[0]!;
  const idx = Math.max(1, Math.min(Math.ceil((value / max) * (COUNTY_COLOR_STOPS.length - 2)) + 1, COUNTY_COLOR_STOPS.length - 1));
  return COUNTY_COLOR_STOPS[idx]!;
}

function FitToRomania({ geojson }: { geojson: Any }) {
  const map = useMap();
  useEffect(() => {
    try {
      const bounds = L.geoJSON(geojson).getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [6, 6], animate: false });
    } catch {
      map.fitBounds([[43.6, 20.2], [48.3, 30.0]], { animate: false });
    }
  }, [geojson, map]);
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export type MapViewMode = "routes" | "judete";

interface Props {
  countyStats:  CountyStats[];
  deliveries:   EnrichedDelivery[];
  colorBy?:     "deliveries" | "km" | "cost";
  viewMode?:    MapViewMode;
}

export function RomaniaMap({
  countyStats, deliveries, colorBy = "deliveries", viewMode = "routes",
}: Props) {
  const [geojson,   setGeojson]   = useState<Any | null>(null);
  const [loading,   setLoading]   = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/tracking/romania-geojson")
      .then(r => r.json())
      .then((d: Any) => { if (!d?.error && d && typeof d === "object") setGeojson(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statsMap = new Map<string, CountyStats>();
  for (const cs of countyStats) statsMap.set(normalizeCounty(cs.county), cs);

  const maxVal = Math.max(
    ...countyStats.map(cs =>
      colorBy === "deliveries" ? cs.deliveryCount :
      colorBy === "km"         ? cs.totalKm : cs.totalLogistic,
    ),
    1,
  );

  const extractName = (props: Any): string =>
    props?.NAME_1 ?? props?.shapeName ?? props?.name ?? props?.NAME ?? props?.county ?? "";

  const countyStyle = (feature?: Any): PathOptions => {
    if (viewMode === "routes") {
      // Subtle grey outlines when showing routes
      return { fillColor: "#e8eaed", fillOpacity: 1, color: "#c4c8cc", weight: 0.6 };
    }
    const rawName = extractName(feature?.properties);
    const cs  = statsMap.get(normalizeCounty(rawName));
    const val = cs ? (colorBy === "deliveries" ? cs.deliveryCount :
                      colorBy === "km"         ? cs.totalKm : cs.totalLogistic) : 0;
    return { fillColor: getCountyColor(val, maxVal), fillOpacity: 1, color: "#bbb", weight: 0.8 };
  };

  const fmtRON = (v: number) =>
    new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
  const fmtNum = (v: number) =>
    new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(v);

  const onEachCounty = (feature: Any, layer: Layer) => {
    const rawName = extractName(feature?.properties);
    const cs = statsMap.get(normalizeCounty(rawName));
    if (viewMode === "routes") {
      (layer as Any).bindTooltip(`<b>${rawName}</b>`, { sticky: true, opacity: 0.8 });
      return;
    }
    const html = cs
      ? `<div style="font-size:12px;line-height:1.7;padding:2px 4px">
           <b>${rawName}</b><br/>
           🚚 <b>${cs.deliveryCount}</b> livrări<br/>
           📍 <b>${fmtNum(cs.totalKm)}</b> km<br/>
           💰 <b>${fmtRON(cs.totalLogistic)}</b> cost
         </div>`
      : `<b>${rawName}</b><br/><span style="color:#999;font-size:11px">Fără livrări</span>`;
    (layer as Any).bindTooltip(html, { sticky: true });
    layer.on({
      mouseover: (e) => (e.target as Any).setStyle({ color: "#333", weight: 2, fillOpacity: 0.82 }),
      mouseout:  (e) => (e.target as Any).setStyle({ color: "#bbb", weight: 0.8, fillOpacity: 1 }),
    });
  };

  const hasRoutes = deliveries.some(d => d.fromCoords && d.toCoords);

  return (
    <div style={{ height: 480, background: "#f5f6f8", borderRadius: 8, overflow: "hidden", position: "relative" }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 500, background: "#f5f6f8",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, color: "#999",
        }}>
          Se încarcă harta...
        </div>
      )}

      {/* Route legend */}
      {viewMode === "routes" && !loading && (
        <div style={{
          position: "absolute", bottom: 16, left: 16, zIndex: 400,
          background: "rgba(255,255,255,0.92)", border: "1px solid #ddd",
          borderRadius: 8, padding: "8px 12px", fontSize: 11, lineHeight: 1.8,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>Frecvență rute</div>
          {[["#7f8c8d","1 livrare"],["#2980b9","2-3 livrări"],["#e67e22","4-7 livrări"],["#c0392b","8+ livrări"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 3, background: c, borderRadius: 2 }} />
              <span>{l}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1e3a5f", border: "2px solid #fff" }} />
            <span>Sediu central (Vestem)</span>
          </div>
        </div>
      )}

      {!hasRoutes && !loading && viewMode === "routes" && (
        <div style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 400,
          background: "rgba(255,255,255,0.9)", border: "1px solid #ddd", borderRadius: 6,
          padding: "6px 12px", fontSize: 12, color: "#666",
        }}>
          Nu există coordonate calculate pentru livrări — verificați că localitățile sunt recunoscute.
        </div>
      )}

      <MapContainer
        center={[45.94, 24.97]}
        zoom={6}
        zoomSnap={0.25}
        style={{ height: "100%", width: "100%", background: "#f5f6f8" }}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={false}
      >
        {geojson && !loading && <FitToRomania geojson={geojson} />}

        {geojson && (
          <GeoJSON
            key={`${viewMode}-${colorBy}`}
            data={geojson}
            style={countyStyle}
            onEachFeature={onEachCounty}
          />
        )}

        {viewMode === "routes" && (
          <RouteLinesLayer deliveries={deliveries} />
        )}
      </MapContainer>
    </div>
  );
}
