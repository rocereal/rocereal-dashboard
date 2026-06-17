"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { CountyStats } from "@/lib/deliveryCostCalculator";
import { COUNTY_CENTERS } from "@/lib/countyMapper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = any;

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

export function RomaniaMap({ countyStats, colorBy = "deliveries" }: Props) {
  const [geojson, setGeojson] = useState<AnyObj | null>(null);
  const [geoFailed, setGeoFailed] = useState(false);
  const [status, setStatus]   = useState<"loading" | "ok" | "fallback">("loading");
  const geoRef = useRef<AnyObj | null>(null); // prevent double-fetch

  useEffect(() => {
    if (geoRef.current) return;
    geoRef.current = true;
    fetch("/api/tracking/romania-geojson")
      .then(r => r.json())
      .then((data: AnyObj) => {
        if (data?.error) { setGeoFailed(true); setStatus("fallback"); }
        else             { setGeojson(data);   setStatus("ok"); }
      })
      .catch(() => { setGeoFailed(true); setStatus("fallback"); });
  }, []);

  // Build lookup map
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

  const getVal = (cs: CountyStats) =>
    colorBy === "deliveries" ? cs.deliveryCount :
    colorBy === "km"         ? cs.totalKm :
                               cs.totalLogistic;

  // ── GeoJSON choropleth style ──────────────────────────────────────────────
  const styleFeature = (feature?: AnyObj): PathOptions => {
    const rawName: string =
      feature?.properties?.name ?? feature?.properties?.NAME ??
      feature?.properties?.county ?? feature?.properties?.COUNTY ?? "";
    const cs  = statsMap.get(normalizeCounty(rawName));
    const val = cs ? getVal(cs) : 0;
    return {
      fillColor:   getColor(val, maxVal),
      fillOpacity: cs ? 0.82 : 0.12,
      color:       "#666",
      weight:      1,
    };
  };

  const onEachFeature = (feature: AnyObj, layer: Layer) => {
    const rawName: string =
      feature?.properties?.name ?? feature?.properties?.NAME ??
      feature?.properties?.county ?? feature?.properties?.COUNTY ?? "";
    const cs = statsMap.get(normalizeCounty(rawName));

    const tooltip = cs
      ? `<div style="font-size:12px;line-height:1.7;min-width:140px">
          <b style="font-size:13px">${rawName}</b><br/>
          🚚 <b>${cs.deliveryCount}</b> livrări<br/>
          📍 <b>${fmtNum(cs.totalKm)}</b> km<br/>
          💰 <b>${fmtRON(cs.totalLogistic)}</b> cost
         </div>`
      : `<b>${rawName}</b><br/><span style="color:#999;font-size:11px">Fără livrări</span>`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer as AnyObj).bindTooltip(tooltip, { sticky: true });

    layer.on({
      mouseover: (e) => (e.target as AnyObj).setStyle({ weight: 2.5, color: "#111", fillOpacity: 0.95 }),
      mouseout:  (e) => (e.target as AnyObj).setStyle({
        weight: 1, color: "#666", fillOpacity: cs ? 0.82 : 0.12,
      }),
    });
  };

  return (
    <div style={{ height: 460 }} className="rounded-lg overflow-hidden relative">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-[500] text-sm text-muted-foreground">
          Se încarcă harta...
        </div>
      )}
      <MapContainer
        center={[45.94, 24.97]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          opacity={0.35}
        />

        {/* Choropleth GeoJSON layer */}
        {geojson && (
          <GeoJSON
            key={colorBy}
            data={geojson}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Fallback: circle markers if GeoJSON failed */}
        {geoFailed && countyStats.map((cs) => {
          const coords = COUNTY_CENTERS[cs.county];
          if (!coords) return null;
          const val    = getVal(cs);
          const radius = 6 + (val / maxVal) * 20;
          return (
            <CircleMarker
              key={cs.county}
              center={coords}
              radius={radius}
              pathOptions={{
                fillColor:   getColor(val, maxVal),
                fillOpacity: 0.8,
                color:       "#c0392b",
                weight:      1,
              }}
            >
              <Tooltip sticky>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <b>{cs.county}</b><br/>
                  {cs.deliveryCount} livrări<br/>
                  {fmtNum(cs.totalKm)} km<br/>
                  {fmtRON(cs.totalLogistic)} cost
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
