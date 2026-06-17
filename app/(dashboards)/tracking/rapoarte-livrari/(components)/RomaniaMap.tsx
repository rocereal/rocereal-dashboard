"use client";

// @ts-ignore – CSS side-effect import for Leaflet; processed by webpack at build time
import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON, useMap, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { CountyStats } from "@/lib/deliveryCostCalculator";
import { COUNTY_CENTERS } from "@/lib/countyMapper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

// ─── Color scale ──────────────────────────────────────────────────────────────
const COLOR_STOPS = [
  "#efefef",                                     // 0 – no data (light grey)
  "#ffe8cc","#ffd09e","#ffb266","#ff8c33",        // 1-4 light → medium orange
  "#e06010","#b84000","#8c2200",                  // 5-7 dark orange → dark red
];

function getColor(value: number, max: number): string {
  if (value === 0 || max === 0) return COLOR_STOPS[0]!;
  const idx = Math.max(
    1,
    Math.min(
      Math.ceil((value / max) * (COLOR_STOPS.length - 2)) + 1,
      COLOR_STOPS.length - 1,
    ),
  );
  return COLOR_STOPS[idx]!;
}

function isDarkColor(value: number, max: number): boolean {
  return max > 0 && value / max > 0.55;
}

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) =>
  new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(v);

function normalizeCounty(name: string): string {
  return (name ?? "").toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t")
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .trim();
}

// ─── Auto-fit map to GeoJSON bounds ──────────────────────────────────────────
function FitBounds({ geojson }: { geojson: Any }) {
  const map = useMap();
  useEffect(() => {
    try {
      const bounds = L.geoJSON(geojson).getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [6, 6], animate: false });
    } catch {
      map.fitBounds([[43.6, 20.2], [48.3, 30.0]], { padding: [6, 6], animate: false });
    }
  }, [geojson, map]);
  return null;
}

// ─── County name labels (permanent, centered in each county) ─────────────────
function CountyLabels({
  geojson, statsMap, getVal, maxVal,
}: {
  geojson: Any;
  statsMap: Map<string, CountyStats>;
  getVal: (cs: CountyStats) => number;
  maxVal: number;
}) {
  const map = useMap();
  const groupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!geojson || groupRef.current) return;
    groupRef.current = L.layerGroup().addTo(map);

    L.geoJSON(geojson).eachLayer((layer: Any) => {
      try {
        const center = layer.getBounds().getCenter();
        const p = layer.feature?.properties ?? {};
        const rawName: string =
          p.NAME_1 ?? p.shapeName ?? p.name ?? p.NAME ?? p.county ?? "";
        const cs  = statsMap.get(normalizeCounty(rawName));
        const val = cs ? getVal(cs) : 0;
        const dark = isDarkColor(val, maxVal);
        // First word, max 9 chars
        const label = (rawName.split(/[\s-]/)[0] ?? rawName).slice(0, 9);

        L.marker(center, {
          interactive: false,
          icon: L.divIcon({
            html: `<span style="font-size:8.5px;font-weight:700;letter-spacing:0.03em;
              color:${dark ? "#fff" : "#444"};
              text-shadow:${dark ? "none" : "0 0 4px #fff,0 0 4px #fff"};
              white-space:nowrap;pointer-events:none;">${label}</span>`,
            className: "",
            iconSize:  [0, 0],
            iconAnchor:[0, 0],
          }),
          zIndexOffset: 1000,
        }).addTo(groupRef.current!);
      } catch { /* bad bounds – skip */ }
    });

    return () => {
      if (groupRef.current) {
        groupRef.current.clearLayers();
        map.removeLayer(groupRef.current);
        groupRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojson]);

  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  countyStats: CountyStats[];
  colorBy?: "deliveries" | "km" | "cost";
}

export function RomaniaMap({ countyStats, colorBy = "deliveries" }: Props) {
  const [geojson,   setGeojson]   = useState<Any | null>(null);
  const [geoFailed, setGeoFailed] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/tracking/romania-geojson")
      .then(r => r.json())
      .then((data: Any) => {
        // Accept FeatureCollection, Feature, or any GeoJSON-like object
        if (data?.error || typeof data !== "object" || data === null) {
          setGeoFailed(true);
        } else {
          setGeojson(data);
        }
      })
      .catch(() => setGeoFailed(true))
      .finally(() => setLoading(false));
  }, []);

  // Build county → stats lookup
  const statsMap = new Map<string, CountyStats>();
  for (const cs of countyStats) statsMap.set(normalizeCounty(cs.county), cs);

  const maxVal = Math.max(
    ...countyStats.map(cs =>
      colorBy === "deliveries" ? cs.deliveryCount :
      colorBy === "km"         ? cs.totalKm : cs.totalLogistic,
    ),
    1,
  );

  const getVal = (cs: CountyStats) =>
    colorBy === "deliveries" ? cs.deliveryCount :
    colorBy === "km"         ? cs.totalKm : cs.totalLogistic;

  // Extract county name from any GeoJSON source (GADM, geoBoundaries, nicktgn…)
  const extractName = (props: Any): string =>
    props?.NAME_1 ??       // GADM 4.x
    props?.shapeName ??    // geoBoundaries
    props?.name ??         // nicktgn / generic
    props?.NAME ??
    props?.county ?? "";

  // GeoJSON feature style
  const styleFeature = (feature?: Any): PathOptions => {
    const rawName  = extractName(feature?.properties);
    const cs  = statsMap.get(normalizeCounty(rawName));
    const val = cs ? getVal(cs) : 0;
    return {
      fillColor:   getColor(val, maxVal),
      fillOpacity: 1,
      color:       "#bbb",
      weight:      0.8,
    };
  };

  const onEachFeature = (feature: Any, layer: Layer) => {
    const rawName = extractName(feature?.properties);
    const cs = statsMap.get(normalizeCounty(rawName));

    const html = cs
      ? `<div style="font-size:12px;line-height:1.75;padding:2px 4px">
           <b style="font-size:13px">${rawName}</b><br/>
           🚚 <b>${cs.deliveryCount}</b> livrări<br/>
           📍 <b>${fmtNum(cs.totalKm)}</b> km<br/>
           💰 <b>${fmtRON(cs.totalLogistic)}</b> cost logistic
         </div>`
      : `<div style="padding:2px 4px">
           <b>${rawName}</b><br/>
           <span style="color:#999;font-size:11px">Fără livrări</span>
         </div>`;

    (layer as Any).bindTooltip(html, { sticky: true, opacity: 0.96 });

    layer.on({
      mouseover: (e) => (e.target as Any).setStyle({ color: "#333", weight: 2, fillOpacity: 0.82 }),
      mouseout:  (e) => (e.target as Any).setStyle({ color: "#bbb", weight: 0.8, fillOpacity: 1 }),
    });
  };

  return (
    <div style={{
      height: 460, background: "#f5f6f8",
      borderRadius: 8, overflow: "hidden", position: "relative",
    }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 500,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f5f6f8", fontSize: 13, color: "#999",
        }}>
          Se încarcă harta...
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
        {/* No TileLayer → pure SVG choropleth like mapchart.net */}

        {geojson && <FitBounds geojson={geojson} />}

        {geojson && (
          <GeoJSON
            key={colorBy}
            data={geojson}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        {geojson && (
          <CountyLabels
            geojson={geojson}
            statsMap={statsMap}
            getVal={getVal}
            maxVal={maxVal}
          />
        )}

        {/* Fallback: circle markers per county when GeoJSON unavailable */}
        {geoFailed && countyStats.map((cs) => {
          const coords = COUNTY_CENTERS[cs.county];
          if (!coords) return null;
          const val    = getVal(cs);
          const radius = 8 + (val / maxVal) * 22;
          return (
            <CircleMarker
              key={cs.county}
              center={coords}
              radius={radius}
              pathOptions={{
                fillColor:   getColor(val, maxVal),
                fillOpacity: 0.9,
                color:       "#999",
                weight:      1,
              }}
            >
              <Tooltip sticky>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <b>{cs.county}</b><br/>
                  {cs.deliveryCount} livrări · {fmtNum(cs.totalKm)} km<br/>
                  {fmtRON(cs.totalLogistic)}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
