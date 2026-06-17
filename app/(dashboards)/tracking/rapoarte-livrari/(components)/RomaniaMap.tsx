"use client";

import { useEffect, useRef } from "react";
import type { CountyStats } from "@/lib/deliveryCostCalculator";

interface Props {
  countyStats: CountyStats[];
  colorBy?: "deliveries" | "km" | "cost";
}

// Normalize county names to match GeoJSON properties
function normalizeCounty(name: string): string {
  return name
    .toLowerCase()
    .replace(/ș|ş/g, "s").replace(/ț|ţ/g, "t")
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .trim();
}

const COLOR_STOPS = ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"];

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

export function RomaniaMap({ countyStats, colorBy = "deliveries" }: Props) {
  const mapRef  = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInst = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;

    // Build lookup: normalized county name → stats
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

    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        zoomControl:     true,
        scrollWheelZoom: false,
        dragging:        true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        opacity:     0.3,
      }).addTo(map);

      map.setView([45.94, 24.97], 6);
      mapInst.current = map;

      // Fetch Romania counties GeoJSON
      fetch("https://raw.githubusercontent.com/nicktgn/RomaniaMap/master/data/counties.json")
        .then(r => r.json())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((geojson: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          L.geoJSON(geojson, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style: (feature: any) => {
              const rawName: string = feature?.properties?.name ?? feature?.properties?.NAME ?? "";
              const normName = normalizeCounty(rawName);
              const cs = statsMap.get(normName);
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
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEachFeature: (feature: any, layer: any) => {
              const rawName: string = feature?.properties?.name ?? feature?.properties?.NAME ?? "";
              const normName = normalizeCounty(rawName);
              const cs = statsMap.get(normName);

              layer.bindTooltip(
                cs
                  ? `<div style="font-size:12px;line-height:1.5">
                      <b>${rawName}</b><br/>
                      ${cs.deliveryCount} livrări<br/>
                      ${fmtNum(cs.totalKm)} km<br/>
                      ${fmtRON(cs.totalLogistic)} cost logistic
                     </div>`
                  : `<b>${rawName}</b><br/><span style="color:#999">Fără livrări</span>`,
                { sticky: true },
              );

              layer.on({
                mouseover: () => layer.setStyle({ weight: 2.5, color: "#222", fillOpacity: 0.95 }),
                mouseout:  () => layer.setStyle({ weight: 1, color: "#555",
                  fillOpacity: cs ? 0.85 : 0.15 }),
              });
            },
          }).addTo(map);
        })
        .catch(() => {
          // GeoJSON fetch failed — fall back to circle markers
          for (const cs of countyStats) {
            const { COUNTY_CENTERS } = require("@/lib/countyMapper");
            const coords = COUNTY_CENTERS[cs.county];
            if (!coords) continue;
            const val = colorBy === "deliveries" ? cs.deliveryCount :
                        colorBy === "km"         ? cs.totalKm : cs.totalLogistic;
            const radius = 8 + (val / maxVal) * 24;
            L.circleMarker(coords, {
              radius, fillColor: "#ef4444", color: "#b91c1c",
              weight: 1, fillOpacity: 0.7,
            }).addTo(map).bindTooltip(
              `<b>${cs.county}</b><br/>${cs.deliveryCount} livrări`,
              { sticky: true },
            );
          }
        });
    });

    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} style={{ height: 460 }} className="rounded-lg overflow-hidden z-0" />;
}
