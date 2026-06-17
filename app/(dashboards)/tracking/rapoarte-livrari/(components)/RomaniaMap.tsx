"use client";

// CSS must be imported at module level for Next.js webpack to process it
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJsonObject = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Feature = any;
import type { CountyStats } from "@/lib/deliveryCostCalculator";

const COLOR_STOPS = ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"];

function normalizeCounty(name: string): string {
  return name.toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t")
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .trim();
}

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return COLOR_STOPS[0]!;
  const idx = Math.min(
    Math.floor((value / max) * (COLOR_STOPS.length - 1)),
    COLOR_STOPS.length - 1,
  );
  return COLOR_STOPS[idx]!;
}

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) =>
  new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(v);

interface Props {
  countyStats: CountyStats[];
  colorBy?: "deliveries" | "km" | "cost";
}

const GEOJSON_URL =
  "https://raw.githubusercontent.com/nicktgn/RomaniaMap/master/data/counties.json";

export function RomaniaMap({ countyStats, colorBy = "deliveries" }: Props) {
  const [geojson, setGeojson] = useState<GeoJsonObject | null>(null);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(r => r.json())
      .then((data: GeoJsonObject) => setGeojson(data))
      .catch(() => setGeoError(true));
  }, []);

  // Build county lookup map
  const statsMap = new Map<string, CountyStats>();
  for (const cs of countyStats) {
    statsMap.set(normalizeCounty(cs.county), cs);
  }

  const maxVal = Math.max(
    ...countyStats.map(c =>
      colorBy === "deliveries" ? c.deliveryCount :
      colorBy === "km"         ? c.totalKm :
                                 c.totalLogistic,
    ),
    1,
  );

  const styleFeature = (feature?: Feature): PathOptions => {
    const rawName = (
      (feature?.properties as Record<string, unknown>)?.name ??
      (feature?.properties as Record<string, unknown>)?.NAME ?? ""
    ) as string;
    const cs  = statsMap.get(normalizeCounty(rawName));
    const val = cs
      ? (colorBy === "deliveries" ? cs.deliveryCount :
         colorBy === "km"         ? cs.totalKm :
                                    cs.totalLogistic)
      : 0;
    return {
      fillColor:   getColor(val, maxVal),
      fillOpacity: cs ? 0.85 : 0.15,
      color:       "#555",
      weight:      1,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const rawName = (
      (feature?.properties as Record<string, unknown>)?.name ??
      (feature?.properties as Record<string, unknown>)?.NAME ?? ""
    ) as string;
    const cs = statsMap.get(normalizeCounty(rawName));

    const tooltip = cs
      ? `<div style="font-size:12px;line-height:1.6">
          <b>${rawName}</b><br/>
          <b>${cs.deliveryCount}</b> livrări<br/>
          <b>${fmtNum(cs.totalKm)}</b> km<br/>
          <b>${fmtRON(cs.totalLogistic)}</b> cost logistic
         </div>`
      : `<b>${rawName}</b><br/><span style="color:#999;font-size:12px">Fără livrări</span>`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer as any).bindTooltip(tooltip, { sticky: true });

    layer.on({
      mouseover: (e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e.target as any).setStyle({ weight: 2.5, color: "#111", fillOpacity: 0.95 });
      },
      mouseout: (e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e.target as any).setStyle({ weight: 1, color: "#555", fillOpacity: cs ? 0.85 : 0.15 });
      },
    });
  };

  return (
    <div style={{ height: 460 }} className="rounded-lg overflow-hidden relative">
      {geoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10 text-sm text-muted-foreground">
          Nu s-a putut încărca GeoJSON România.
        </div>
      )}
      <MapContainer
        center={[45.94, 24.97]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          opacity={0.35}
        />
        {geojson && (
          <GeoJSON
            key={colorBy}
            data={geojson}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
